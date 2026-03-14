"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { type CurrentUser } from "@/lib/auth/get-current-user";
import { logoutAction } from "@/lib/supabase/auth-actions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Quản lý Bài viết",
    icon: <FileText size={16} />,
  },
  {
    href: "/admin/settings",
    label: "Cài đặt",
    icon: <Settings size={16} />,
  },
];

/**
 * Admin sidebar — dark navy (#0F172A), 240px width.
 * Matches .pen design: logo, nav items, user info at bottom.
 * Responsive: collapses to top bar with hamburger on tablet.
 */
export function AdminSidebar({ currentUser }: { currentUser: CurrentUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = getInitials(currentUser.profile.full_name || currentUser.email);

  return (
    <>
      {/* Mobile/Tablet top bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Image
            src="/images/LOGO_header_36.png"
            alt="HIEA"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-base font-bold text-primary">HIEA</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#334155] text-xs font-semibold text-white">
          {initials}
        </div>
      </div>

      {/* Mobile slide-down nav */}
      {mobileOpen && (
        <nav className="border-b border-border bg-white px-5 py-3 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium ${
                pathname.startsWith(item.href)
                  ? "bg-surface text-primary"
                  : "text-muted hover:bg-surface"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </form>
        </nav>
      )}

      {/* Desktop sidebar — 240px, dark navy */}
      <aside className="hidden w-60 flex-col justify-between bg-[#0F172A] py-6 lg:flex">
        {/* Top: Logo + Nav */}
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5">
            <Image
              src="/images/LOGO_header_36.png"
              alt="HIEA"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="text-lg font-bold text-white">HIEA</span>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm ${
                    isActive
                      ? "border-l-[3px] border-primary bg-[#1E293B] font-semibold text-primary"
                      : "border-l-[3px] border-transparent font-normal text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Logout nav item */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 border-l-[3px] border-transparent px-5 py-3 text-sm font-normal text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </form>
          </nav>
        </div>

        {/* Bottom: User info */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#334155] text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-white">
              {currentUser.profile.full_name || currentUser.email}
            </span>
            <span className="inline-block rounded bg-[#1E293B] px-2 py-0.5 text-[11px] font-medium capitalize text-[#94A3B8]">
              {currentUser.profile.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

/** Extract initials from name or email */
function getInitials(nameOrEmail: string): string {
  const parts = nameOrEmail.split(/[\s@]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nameOrEmail.substring(0, 2).toUpperCase();
}
