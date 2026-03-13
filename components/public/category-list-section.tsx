import Image from "next/image";
import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/queries/article-queries";
import { formatDate } from "@/lib/utils/format-date";

/**
 * Compact category list section — thumbnail 80x60 + title + date.
 * Used for "Chính sách" and "Tin tức & Sự kiện" sections on homepage.
 * Background: surface (#F3F4F6) from .pen design.
 */
export default function CategoryListSection({
  title,
  viewAllHref,
  articles,
  showBackground = true,
}: {
  title: string;
  viewAllHref: string;
  articles: ArticleWithCategory[];
  showBackground?: boolean;
}) {
  if (articles.length === 0) return null;

  return (
    <section className={showBackground ? "bg-surface" : ""}>
      <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-lg:py-10 max-md:px-4 max-md:py-8">
        <div className="flex flex-col gap-8">
          {/* Section heading row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-7 w-1 rounded-sm bg-primary" />
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            </div>
            <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {/* Compact list items */}
          <div className="flex flex-col gap-8">
            {articles.map((article, idx) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={`group flex items-center gap-4 ${
                  idx < articles.length - 1 ? "border-b border-border pb-4" : ""
                }`}
              >
                {/* Thumbnail — 80x60px, rounded */}
                <div className="relative h-[60px] w-[80px] shrink-0 overflow-hidden rounded-md">
                  {article.featured_image_url ? (
                    <Image
                      src={article.featured_image_url}
                      alt={article.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-border text-xs text-muted">
                      Ảnh
                    </div>
                  )}
                </div>

                {/* Text group — title + date */}
                <div className="flex flex-col gap-2">
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <span className="text-[13px] text-muted">
                    {formatDate(article.published_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
