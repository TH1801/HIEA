import { type CurrentUser } from "@/lib/auth/get-current-user";
import { logoutAction } from "@/lib/supabase/auth-actions";

/**
 * Admin sidebar with user info and logout button.
 * Server component — receives currentUser from the protected layout.
 */
export function AdminSidebar({ currentUser }: { currentUser: CurrentUser }) {
  return (
    <aside className="flex w-64 flex-col border-r border-bg-alt bg-white p-4">
      {/* Branding */}
      <span className="text-lg font-bold text-primary">HIEA Admin</span>

      {/* Navigation placeholder — will be implemented in Phase 6 */}
      <nav className="mt-6 flex-1">
        <a
          href="/admin/dashboard"
          className="block rounded px-3 py-2 text-sm font-medium text-text hover:bg-bg-alt"
        >
          Dashboard
        </a>
      </nav>

      {/* User info + logout */}
      <div className="border-t border-bg-alt pt-4">
        <p className="text-sm font-medium text-text">
          {currentUser.profile.full_name || currentUser.email}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {currentUser.profile.role}
        </p>
        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="text-sm text-red-600 hover:text-red-800"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  );
}
