import Image from "next/image";
import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/queries/article-queries";
import { formatDate, estimateReadingTime } from "@/lib/utils/format-date";

/** Category tag color mapping from .pen design */
const TAG_STYLES: Record<string, string> = {
  news: "bg-primary/10 text-primary",
  policies: "bg-[#0F3460]/10 text-[#0F3460]",
  events: "bg-accent/10 text-accent",
};

/** Reusable article card — matches Component/ArticleCard from .pen design */
export default function ArticleCard({ article }: { article: ArticleWithCategory }) {
  const categorySlug = article.category?.slug ?? "";
  const tagStyle = TAG_STYLES[categorySlug] ?? "bg-primary/10 text-primary";

  return (
    <Link
      href={`${categorySlug === "policies" ? "/policies" : "/news"}/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Card image — 200px height, 16:9-ish */}
      <div className="relative h-[200px] w-full overflow-hidden">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title ?? ""}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-border text-sm text-muted">
            Hình ảnh
          </div>
        )}
      </div>

      {/* Card body — padding 20px, gap 12px */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category tag */}
        {article.category && (
          <span className={`w-fit rounded px-2.5 py-1 text-xs font-semibold ${tagStyle}`}>
            {article.category.name}
          </span>
        )}

        {/* Title — 16px semibold, 2 lines max */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>

        {/* Excerpt — 14px, 2-3 lines */}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">
          {article.excerpt}
        </p>

        {/* Meta: date + read time */}
        <div className="mt-auto flex items-center justify-between text-xs text-muted">
          <span>{formatDate(article.published_at)}</span>
          <span>{estimateReadingTime(article.excerpt)} phút đọc</span>
        </div>
      </div>
    </Link>
  );
}
