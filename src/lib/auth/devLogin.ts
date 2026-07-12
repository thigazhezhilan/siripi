// DEMO ONLY — replace with real phone-OTP verification before launch.
// See supabase/migrations/0001_init.sql and the Phase 1 client-demo plan for
// context on the real flow this stands in for.
//
// Creates a genuine Supabase auth session (anonymous sign-in) so RLS and
// profile-linkage via auth.uid() work exactly like the real OTP flow will —
// only the "prove you own this phone number" verification step is faked. The
// typed phone number is stashed in auth user_metadata immediately; it's copied
// onto the `profiles` row itself when the personal-details onboarding step is
// submitted (profiles.full_name/gender/date_of_birth are NOT NULL, so no
// profile row exists until that step creates one).
//
// Gated behind NEXT_PUBLIC_DEV_SKIP_OTP. Swap this file for real OTP
// verification later; nothing else in the auth/session/RLS model should need
// to change.

import { supabase } from "../supabase";

export const DEV_SKIP_OTP = process.env.NEXT_PUBLIC_DEV_SKIP_OTP === "true";

export type DevLoginResult = {
  hasProfile: boolean;
  isActive: boolean;
};

export async function devLoginWithPhone(phoneNumber: string): Promise<DevLoginResult> {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { phone_number: phoneNumber },
  });
  if (metadataError) throw metadataError;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw userError ?? new Error("No authenticated user after anonymous sign-in.");
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
