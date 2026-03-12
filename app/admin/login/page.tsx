"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/supabase/auth-actions";

/**
 * Admin login page — email/password form with HIEA branding.
 * URL: /admin/login
 */
export default function LoginPage() {
  const [error, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-alt">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        {/* Branding */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">HIEA Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Đăng nhập để quản lý nội dung
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-text"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="admin@hiea.vn"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-text"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
