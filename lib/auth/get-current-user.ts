import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  profile: {
    full_name: string | null;
    role: "editor" | "admin";
  };
};

/**
 * Fetches the authenticated user and their profile from Supabase.
 * Returns null if not authenticated or profile not found.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email!,
    profile: {
      full_name: profile.full_name,
      role: profile.role,
    },
  };
}
