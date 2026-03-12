"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Server action: authenticate user with email + password.
 * Returns an error string on failure, or redirects on success.
 */
export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "Vui lòng nhập email và mật khẩu.";
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return "Email hoặc mật khẩu không đúng.";
  }

  redirect("/admin/dashboard");
}

/**
 * Server action: sign out the current user and redirect to login.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
