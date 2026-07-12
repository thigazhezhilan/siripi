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
// New vs. existing account is not asked explicitly (see auth/page.tsx): we
// try signInWithPassword first, and only attempt signUp if that fails. This
// avoids a separate "does this phone exist" lookup, which would let anyone
// probe which phone numbers are registered.

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

export type PhoneAuthResult = {
  hasProfile: boolean;
  isActive: boolean;
};

export async function signInOrSignUpWithPhone(
  phoneNumber: string,
  password: string
): Promise<PhoneAuthResult> {
  const email = phoneToSyntheticEmail(phoneNumber);

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      if (/already registered|already exists/i.test(signUpError.message)) {
        throw new Error("auth.incorrectPassword");
      }
      throw signUpError;
    }

    if (!signUpData.session) {
      throw new Error(
        "Sign-up succeeded but no session was returned — check that 'Confirm email' is disabled " +
          "under Authentication > Providers > Email in the Supabase dashboard."
      );
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: { phone_number: phoneNumber },
    });
    if (metadataError) throw metadataError;
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

  return {
    hasProfile: profile !== null,
    isActive: profile?.status === "active",
  };
}
