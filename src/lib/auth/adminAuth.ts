// Admin auth — deliberately separate from src/lib/auth/devLogin.ts. Real
// email+password Supabase auth, not the phone-number dev-login stub regular
// users get. No self-serve admin signup: admin rows are created manually via the
// Supabase dashboard/SQL (insert into auth.users + admin_users).

import { supabase } from "../supabase";

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw signInError;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw userError ?? new Error("No authenticated user after sign-in.");
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (adminError) throw adminError;

  if (!adminRow) {
    await supabase.auth.signOut();
    throw new Error("This account is not authorized for admin access.");
  }
}
