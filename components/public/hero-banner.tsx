import Image from "next/image";
import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/queries/article-queries";
import { formatDate } from "@/lib/utils/format-date";

/** Full-width hero with featured article: text-left (60%) + image-right (40%) on desktop */
export default function HeroBanner({ article }: { article: ArticleWithCategory | null }) {
  if (!article) return <HeroBannerEmpty />;

  return (
    <section className="bg-hero-bg">
      <div className="mx-auto flex max-w-[1440px] items-center gap-12 px-12 py-16 pb-12 max-lg:flex-col max-lg:gap-6 max-lg:px-6 max-lg:py-10 max-md:gap-5 max-md:px-4 max-md:py-8">
        {/* Text side */}
        <div className="flex flex-1 flex-col gap-5 max-lg:order-2">
          <span className="w-fit rounded bg-accent px-3.5 py-1.5 text-xs font-bold text-white">
            Nổi bật
          </span>
          <h1 className="text-[32px] font-bold leading-[1.3] text-foreground max-md:text-2xl">
            {article.title}
          </h1>
          <p className="leading-relaxed text-muted">
            {article.excerpt}
          </p>
          <Link
            href={`${article.category?.slug === "policies" ? "/policies" : "/news"}/${article.slug}`}
            className="flex h-11 w-fit items-center rounded-md bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Xem thêm →
          </Link>
        </div>

        {/* Image side */}
        <div className="relative aspect-video w-[540px] shrink-0 overflow-hidden rounded-lg max-lg:order-1 max-lg:w-full">
          {article.featured_image_url ? (
            <Image
              src={article.featured_image_url}
              alt={article.title ?? ""}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 540px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-border text-muted">
              Hình ảnh
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Empty state when no featured article exists */
function HeroBannerEmpty() {
  return (
    <section className="bg-hero-bg">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-12 py-20 max-lg:px-6 max-md:px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Chào mừng đến với HIEA</h2>
          <p className="mt-3 text-muted">
            Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh — Thúc đẩy hợp tác thương mại quốc tế từ năm 1975.
          </p>
        </div>
      </div>
    </section>
  );
}
