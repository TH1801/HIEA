"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/news", label: "Tin tức & Sự kiện" },
  { href: "/policies", label: "Chính sách" },
  { href: "/contact", label: "Liên hệ" },
];

export default function HeaderNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-primary bg-background">
      {/* Desktop header — 72px */}
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-12 max-lg:hidden">
        <LeftGroup />
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <RightGroup />
      </div>

      {/* Tablet header — 64px */}
      <div className="mx-auto flex h-16 items-center justify-between px-6 max-md:hidden lg:hidden">
        <div className="flex items-center gap-3">
          <Image src="/logo-hiea.png" alt="HIEA" width={36} height={36} className="rounded-md" />
          <span className="text-lg font-bold text-primary">HIEA</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">Trang chủ</Link>
          <Link href="/news" className="text-sm font-medium text-foreground hover:text-primary">Tin tức</Link>
          <Link href="/policies" className="text-sm font-medium text-foreground hover:text-primary">Chính sách</Link>
        </nav>
        <div className="flex items-center gap-3">
          <SearchIcon />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <HamburgerIcon />
          </button>
        </div>
      </div>

      {/* Mobile header — 60px */}
      <div className="flex h-[60px] items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo-hiea.png" alt="HIEA" width={36} height={36} className="rounded-md" />
          <span className="text-lg font-bold text-primary">HIEA</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <HamburgerIcon />
        </button>
      </div>

      {/* Mobile/Tablet slide-down menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin/login"
                className="mt-2 block rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cổng Hội viên
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/** Left group: logo + wordmark + divider + tagline */
function LeftGroup() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logo-hiea.png" alt="HIEA" width={48} height={48} className="rounded-md" />
      <span className="text-xl font-bold text-primary">HIEA</span>
      <div className="h-6 w-px bg-border" />
      <span className="text-sm text-muted">Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh</span>
    </div>
  );
}

/** Right group: search icon + CTA button */
function RightGroup() {
  return (
    <div className="flex items-center gap-4">
      <SearchIcon />
      <Link
        href="/admin/login"
        className="flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
      >
        Cổng Hội viên
      </Link>
    </div>
  );
}

function SearchIcon() {
  return (
    <button aria-label="Tìm kiếm" className="text-muted hover:text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
