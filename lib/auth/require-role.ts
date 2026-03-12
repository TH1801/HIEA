import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "./get-current-user";

/**
 * Server-side role guard. Redirects to dashboard if user lacks required role.
 * Call at the top of admin page server components.
 */
export async function requireRole(
  allowedRoles: Array<"editor" | "admin">
): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  if (!allowedRoles.includes(currentUser.profile.role)) {
    redirect("/admin/dashboard");
  }

  return currentUser;
}
