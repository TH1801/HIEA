import { requireRole } from "@/lib/auth/require-role";
import { SettingsForm } from "@/components/admin/settings-form";

/**
 * Admin settings page — change password + user info.
 * URL: /admin/settings
 */
export default async function SettingsPage() {
  const currentUser = await requireRole(["editor", "admin"]);

  return (
    <div className="mx-auto max-w-xl px-5 py-6 lg:px-10 lg:py-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Cài đặt</h1>

      {/* User info */}
      <section className="mb-8 rounded-lg border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Thông tin tài khoản
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Email</span>
            <span className="font-medium text-foreground">
              {currentUser.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Họ tên</span>
            <span className="font-medium text-foreground">
              {currentUser.profile.full_name || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Vai trò</span>
            <span className="inline-block rounded bg-surface px-2 py-0.5 text-xs font-medium capitalize text-muted">
              {currentUser.profile.role}
            </span>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Đổi mật khẩu
        </h2>
        <SettingsForm />
      </section>
    </div>
  );
}
