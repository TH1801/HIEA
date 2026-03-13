import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/news", label: "Tin tức & Sự kiện" },
  { href: "/policies", label: "Chính sách" },
  { href: "/contact", label: "Liên hệ" },
];

const RESOURCES = [
  { href: "#", label: "Báo cáo Thương mại" },
  { href: "#", label: "Văn bản Pháp luật" },
  { href: "/admin/login", label: "Cổng Hội viên" },
  { href: "#", label: "Câu hỏi thường gặp" },
];

const CONTACT_INFO = [
  { icon: "map-pin", text: "35 Võ Thị Sáu, Quận 1, TP. HCM" },
  { icon: "phone", text: "+84 28 3829 2100" },
  { icon: "mail", text: "info@hiea.org.vn" },
];

export default function FooterSection() {
  return (
    <footer className="bg-footer-bg text-white">
      <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-md:px-4">
        {/* Top row — 4 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-4 gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo-hiea.png" alt="HIEA" width={48} height={48} className="rounded-md" />
              <span className="text-lg font-bold">HIEA</span>
            </div>
            <p className="text-sm leading-relaxed text-[#9CA3AF]">
              Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh — Thúc đẩy hợp tác thương mại quốc tế từ năm 1975.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-[13px] font-semibold tracking-wide">Liên kết nhanh</h3>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-[#9CA3AF] transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-[13px] font-semibold tracking-wide">Tài liệu</h3>
            {RESOURCES.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-[#9CA3AF] transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-[13px] font-semibold tracking-wide">Liên hệ</h3>
            {CONTACT_INFO.map((item) => (
              <div key={item.icon} className="flex items-center gap-2">
                <ContactIcon name={item.icon} />
                <span className="text-sm text-[#9CA3AF]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-[#374151]" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-3 max-md:text-center">
          <p className="text-[13px] text-muted">
            © 2026 HIEA — Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh. Mọi quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[13px] text-muted transition-colors hover:text-accent">
              Chính sách Bảo mật
            </Link>
            <Link href="#" className="text-[13px] text-muted transition-colors hover:text-accent">
              Điều khoản Sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactIcon({ name }: { name: string }) {
  const iconPaths: Record<string, React.ReactNode> = {
    "map-pin": (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {iconPaths[name]}
    </svg>
  );
}
