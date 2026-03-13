import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/queries/article-queries";
import ArticleCard from "@/components/public/article-card";

/**
 * Latest news grid section — 3-col desktop, 2-col tablet, 1-col mobile.
 * Section heading with 4px primary left-border accent + "Xem tất cả →" link.
 */
export default function ArticleGrid({
  title,
  viewAllHref,
  articles,
}: {
  title: string;
  viewAllHref: string;
  articles: ArticleWithCategory[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-12 max-lg:px-6 max-md:px-4">
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

        {/* Card grid — 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
