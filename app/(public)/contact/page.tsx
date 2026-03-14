"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronDown, CheckCircle, ExternalLink } from "lucide-react";

const CONTACT_CARDS = [
  { icon: MapPin, title: "Địa chỉ", lines: ["35 Võ Thị Sáu, Quận 1, TP. Hồ Chí Minh"] },
  { icon: Phone, title: "Điện thoại", lines: ["+84 28 3829 2100", "Thứ Hai — Thứ Sáu, 8:00 — 17:00"] },
  { icon: Mail, title: "Email", lines: ["info@hiea.org.vn", "Phản hồi trong vòng 24 giờ"] },
];

const BENEFITS = [
  "Tiếp cận thông tin chính sách và pháp luật thương mại",
  "Tham gia các sự kiện xúc tiến thương mại quốc tế",
  "Kết nối mạng lưới doanh nghiệp hàng đầu",
  "Hỗ trợ đào tạo và tư vấn chuyên môn",
];

const FAQ_ITEMS = [
  { q: "Làm thế nào để trở thành hội viên?", a: "Doanh nghiệp có hoạt động xuất nhập khẩu tại TP. Hồ Chí Minh có thể nộp đơn đăng ký trực tuyến hoặc trực tiếp tại văn phòng Hiệp hội. Hồ sơ bao gồm giấy phép kinh doanh, đơn đăng ký và phí hội viên năm đầu tiên. Quá trình xét duyệt thường mất 5–7 ngày làm việc." },
  { q: "Phí hội viên hàng năm là bao nhiêu?", a: "Phí hội viên được tính theo quy mô doanh nghiệp, dao động từ 2.000.000 đến 10.000.000 VNĐ/năm. Liên hệ văn phòng Hiệp hội để được tư vấn chi tiết." },
  { q: "Hội viên được hưởng những quyền lợi gì?", a: "Hội viên được tiếp cận thông tin chính sách, tham gia sự kiện xúc tiến thương mại, kết nối mạng lưới doanh nghiệp và hỗ trợ đào tạo chuyên môn." },
  { q: "Tôi có thể tham gia sự kiện nào của Hiệp hội?", a: "HIEA tổ chức nhiều sự kiện bao gồm hội thảo chuyên đề, triển lãm thương mại, đoàn khảo sát thị trường và các buổi giao lưu doanh nghiệp hàng tháng." },
];

/** Google Maps embed for 35 Vo Thi Sau, District 1, HCMC */
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.691!3d10.7895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z35IFbw!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      {/* Hero Section — dark overlay with contact cards overlapping */}
      <section className="relative">
        <div className="flex flex-col items-center justify-center gap-3 bg-primary/70 bg-[url('https://images.unsplash.com/photo-1605459799855-ed078d2fefb4?w=1200&q=80')] bg-cover bg-center bg-blend-multiply px-12 py-20 text-center max-lg:px-6 max-md:px-4 max-md:py-14">
          <nav className="text-sm text-white/70">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">→</span>
            <span className="text-white">Liên hệ</span>
          </nav>
          <h1 className="text-5xl font-bold text-white max-md:text-3xl">Liên hệ</h1>
          <p className="text-xl text-white/80 max-md:text-base">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
        {/* Contact info cards — overlapping hero bottom */}
        <div className="mx-auto -mt-12 grid max-w-[1200px] gap-6 px-12 max-lg:px-6 max-md:grid-cols-1 max-md:px-4 md:grid-cols-3">
          {CONTACT_CARDS.map((c) => (
            <div key={c.title} className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 text-center shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <c.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
              {c.lines.map((l, i) => (
                <p key={i} className={`text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted"}`}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Google Maps embed */}
      <section className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-md:px-4">
        <div className="overflow-hidden rounded-lg">
          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí văn phòng HIEA"
          />
        </div>
      </section>

      {/* CTA — Become a member */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-[1200px] items-center gap-12 px-12 py-16 max-lg:flex-col max-lg:px-6 max-lg:py-12 max-md:px-4">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground max-md:text-2xl">
              Trở thành Hội viên HIEA
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Gia nhập mạng lưới doanh nghiệp xuất nhập khẩu hàng đầu tại TP. Hồ Chí Minh và tận hưởng những quyền lợi độc quyền dành cho hội viên.
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <CheckCircle size={20} className="shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href="https://docs.google.com/forms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
              >
                Đăng ký Hội viên <ExternalLink size={16} />
              </a>
              <p className="text-[13px] text-muted">Miễn phí đăng ký cho doanh nghiệp lần đầu</p>
            </div>
          </div>
          {/* Decorative image — hidden on mobile/tablet */}
          <div className="hidden overflow-hidden rounded-lg lg:block lg:w-[480px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1742810242385-35df57c954b0?w=600&q=80" alt="Hội viên HIEA" className="h-[400px] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex justify-center px-12 py-16 max-lg:px-6 max-lg:py-12 max-md:px-4">
        <div className="w-full max-w-[800px] space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-9 w-1 rounded-sm bg-primary" />
            <h2 className="text-4xl font-semibold tracking-tight text-foreground max-md:text-2xl">Câu hỏi thường gặp</h2>
          </div>
          <div>
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className={`${openFaq === i ? "rounded-md bg-surface" : "border-b border-border"}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown size={20} className={`shrink-0 text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
