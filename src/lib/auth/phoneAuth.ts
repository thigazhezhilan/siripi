// Phone number + password auth, built on top of Supabase's email+password auth.
// Supabase's phone auth is OTP-only (needs a paid SMS provider + India DLT
// registration), so real phone verification is out of scope for now — the
// phone number instead becomes a synthetic email address, and Supabase's
// standard password auth provides the actual session/security.
//
// REQUIRES: "Confirm email" must be disabled in the Supabase dashboard
// (Authentication -> Providers -> Email) — sign-up uses a synthetic address
// nobody can read, so there's no inbox to click a confirmation link from.
//
// New vs. existing account is now an explicit choice made on the landing
// page (New User / Already Registered tabs), so register/login map directly
// to signUp/signInWithPassword — no probing needed to infer intent.

import type { SupportedLanguage } from "../i18n";
import { supabase } from "../supabase";

// Supabase's email validator rejects reserved/special-use TLDs (.local, .test,
// .example, .invalid), so this needs to look like an ordinary domain even
// though nothing is ever actually sent to it.
const SYNTHETIC_EMAIL_DOMAIN = "phone.sirpi-app.com";

function normalizePhone(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

function phoneToSyntheticEmail(phoneNumber: string): string {
  return `${normalizePhone(phoneNumber)}@${SYNTHETIC_EMAIL_DOMAIN}`;
}

function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === "en" || value === "ta";
}

export async function registerWithPhone(
  phoneNumber: string,
  password: string,
  language: SupportedLanguage
): Promise<void> {
  const email = phoneToSyntheticEmail(phoneNumber);
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      throw new Error("auth.phoneAlreadyRegistered");
    }
    throw error;
  }

  if (!data.session) {
    throw new Error(
      "Sign-up succeeded but no session was returned — check that 'Confirm email' is disabled " +
        "under Authentication > Providers > Email in the Supabase dashboard."
    );
  }

  // Stored on the auth user (not the `profiles` row, which doesn't exist until
  // onboarding's personal-details step creates it) so the language preference
  // survives a login from a fresh device/browser with no localStorage.
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { phone_number: phoneNumber, preferred_language: language },
  });
  if (metadataError) throw metadataError;
}

export type LoginResult = {
  hasProfile: boolean;
  isActive: boolean;
  preferredLanguage: SupportedLanguage | null;
};

export async function loginWithPhone(phoneNumber: string, password: string): Promise<LoginResult> {
  const email = phoneToSyntheticEmail(phoneNumber);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Deliberately generic — same reasoning Supabase's own error message
    // follows — so this can't be used to probe which phone numbers exist.
    throw new Error("auth.loginFailed");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw userError ?? new Error("No authenticated user after sign-in.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  const storedLanguage = userData.user.user_metadata?.preferred_language;

  return {
    hasProfile: profile !== null,
    isActive: profile?.status === "active",
    preferredLanguage: isSupportedLanguage(storedLanguage) ? storedLanguage : null,
  };
}
