import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ — HIEA",
  description: "Liên hệ Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh — Địa chỉ, điện thoại, email và đăng ký hội viên.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
