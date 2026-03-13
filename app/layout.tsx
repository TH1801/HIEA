import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HIEA - Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh",
    template: "%s | HIEA",
  },
  description:
    "Trang thông tin chính thức của Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh — Thúc đẩy hợp tác thương mại quốc tế từ năm 1975.",
  openGraph: {
    locale: "vi_VN",
    type: "website",
    siteName: "HIEA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
