import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Protected admin layout — sidebar + main content area.
 * Redirects to login if no session.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar currentUser={currentUser} />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
