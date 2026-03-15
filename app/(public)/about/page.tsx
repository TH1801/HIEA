import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, ShieldCheck, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Giới thiệu — HIEA",
  description: "Hiệp hội Xuất Nhập khẩu Thành phố Hồ Chí Minh — Tầm nhìn, sứ mệnh và ban chấp hành.",
};

const CORE_VALUES = [
  { icon: Handshake, title: "Kết nối", desc: "Xây dựng mạng lưới kết nối vững chắc giữa các doanh nghiệp, đối tác và thị trường trong nước và quốc tế." },
  { icon: ShieldCheck, title: "Minh bạch", desc: "Hoạt động minh bạch, công khai thông tin và đảm bảo quyền lợi công bằng cho tất cả doanh nghiệp hội viên." },
  { icon: Lightbulb, title: "Đổi mới", desc: "Không ngừng đổi mới phương thức hoạt động, ứng dụng công nghệ số và sáng tạo giải pháp hỗ trợ doanh nghiệp." },
];

const BOARD_MEMBERS = [
  { name: "Ông Nguyễn Văn A", role: "Chủ tịch" },
  { name: "Bà Trần Thị B", role: "Phó Chủ tịch" },
  { name: "Ông Lê Văn C", role: "Tổng Thư ký" },
  { name: "Bà Phạm Thị D", role: "Ủy viên" },
  { name: "Ông Hoàng Văn E", role: "Ủy viên" },
];

const MILESTONES = [
  { year: "1975", text: "Thành lập Hiệp hội" },
  { year: "1995", text: "Mở rộng hợp tác quốc tế" },
  { year: "2010", text: "Đạt 500 doanh nghiệp hội viên" },
  { year: "2025", text: "Ra mắt nền tảng số" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section — blue overlay on background image */}
      <section className="flex flex-col items-center justify-center gap-4 bg-primary/60 bg-[url('https://images.unsplash.com/photo-1705253920175-8df4e2408113?w=1200&q=80')] bg-cover bg-center bg-blend-multiply px-12 py-20 text-center max-lg:px-6 max-md:px-4 max-md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-white/70">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          <span className="mx-2">→</span>
          <span className="text-white">Giới thiệu</span>
        </nav>
        <h1 className="text-[40px] font-bold text-white max-md:text-3xl">Giới thiệu</h1>
        <p className="text-lg text-white/80">Hiệp hội Xuất Nhập khẩu Thành phố Hồ Chí Minh</p>
      </section>

      {/* Vision & Mission */}
      <section className="mx-auto flex max-w-[1440px] gap-12 px-12 py-16 max-lg:flex-col max-lg:gap-8 max-lg:px-6 max-lg:py-12 max-md:px-4">
        <div className="flex-1 space-y-4 border-l-4 border-primary pl-6">
          <h2 className="text-[28px] font-bold text-foreground max-md:text-2xl">Tầm nhìn</h2>
          <p className="leading-relaxed text-muted">
            Trở thành hiệp hội thương mại hàng đầu khu vực Đông Nam Á, kết nối doanh nghiệp Việt Nam với thị trường quốc tế, thúc đẩy tăng trưởng bền vững và nâng cao năng lực cạnh tranh cho cộng đồng doanh nghiệp xuất nhập khẩu.
          </p>
        </div>
        <div className="flex-1 space-y-4 border-l-4 border-primary pl-6">
          <h2 className="text-[28px] font-bold text-foreground max-md:text-2xl">Sứ mệnh</h2>
          <p className="leading-relaxed text-muted">
            Thúc đẩy hoạt động thương mại quốc tế, hỗ trợ doanh nghiệp hội viên tiếp cận thị trường toàn cầu, cung cấp thông tin chính sách và pháp luật, tổ chức các hoạt động xúc tiến thương mại và đào tạo nâng cao năng lực kinh doanh.
          </p>
        </div>
      </section>

      {/* Core Values — 3 cards */}
      <section className="mx-auto max-w-[1440px] space-y-10 px-12 py-16 max-lg:px-6 max-lg:py-12 max-md:px-4">
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-[28px] font-bold text-foreground max-md:text-2xl">Giá trị cốt lõi</h2>
        </div>
        <div className="grid gap-8 max-md:grid-cols-1 md:grid-cols-3">
          {CORE_VALUES.map((v) => (
            <div key={v.title} className="space-y-4 rounded-lg bg-surface p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <v.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Board — member grid */}
      <section className="mx-auto max-w-[1440px] space-y-10 px-12 py-16 max-lg:px-6 max-lg:py-12 max-md:px-4">
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-[28px] font-bold text-foreground max-md:text-2xl">Ban Chấp hành</h2>
        </div>
        <div className="grid gap-8 rounded-lg bg-surface p-8 max-md:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {BOARD_MEMBERS.map((m) => (
            <div key={m.name} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {m.name.split(" ").pop()?.charAt(0)}
              </div>
              <p className="text-lg font-semibold text-foreground max-md:text-base">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History Timeline — milestones with left border */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1440px] space-y-10 px-12 py-16 max-lg:px-6 max-lg:py-12 max-md:px-4">
          <div className="border-l-4 border-primary pl-6">
            <h2 className="text-[28px] font-bold text-foreground max-md:text-2xl">Lịch sử hình thành</h2>
          </div>
          <div className="space-y-8 border-l-2 border-primary pl-8">
            {MILESTONES.map((ms) => (
              <div key={ms.year} className="relative flex items-center gap-4">
                <div className="absolute -left-[41px] h-3 w-3 rounded-md bg-primary" />
                <span className="font-bold text-primary">{ms.year}</span>
                <span className="text-foreground">— {ms.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
