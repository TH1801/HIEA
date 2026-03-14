"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/admin-article-actions";

/**
 * Change password form — client component with server action.
 */
export function SettingsForm() {
  const [state, formAction, isPending] = useActionState(changePassword, null);
  const isSuccess = state === "success";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="newPassword"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Mật khẩu mới
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Nhập lại mật khẩu mới"
        />
      </div>

      {state && !isSuccess && (
        <p className="text-sm text-destructive">{state}</p>
      )}
      {isSuccess && (
        <p className="text-sm text-[#03543F]">Đổi mật khẩu thành công!</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
