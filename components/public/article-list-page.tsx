import Link from "next/link";
import type { ArticleWithCategory } from "@/lib/queries/article-queries";
import ArticleCard from "@/components/public/article-card";
import PaginationControls from "@/components/public/pagination-controls";
import EmptyStateContent from "@/components/public/empty-state-content";

type BreadcrumbItem = { label: string; href?: string };

type ArticleListPageProps = {
  title: string;
  description: string;
  breadcrumbItems: BreadcrumbItem[];
  articles: ArticleWithCategory[];
  currentPage: number;
  totalPages: number;
  basePath: string;
};

/** Shared article list page — breadcrumb header + card grid + pagination */
export default function ArticleListPage({
  title,
  description,
  breadcrumbItems,
  articles,
  currentPage,
  totalPages,
  basePath,
}: ArticleListPageProps) {
  return (
    <div>
      {/* Page header — light blue bg per design */}
      <div className="bg-hero-bg py-12 max-md:py-8">
        <div className="mx-auto max-w-[1440px] px-12 max-lg:px-6 max-md:px-4">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted">
            {breadcrumbItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span className="mx-2">→</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-4xl font-bold text-foreground max-md:text-2xl">
            {title}
          </h1>
          <p className="mt-3 text-base text-muted max-md:text-sm">
            {description}
          </p>
        </div>
      </div>

      {/* Article grid + pagination */}
      <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-md:px-4 max-md:py-8">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="mt-12">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </div>
          </>
        ) : (
          <EmptyStateContent />
        )}
      </div>
    </div>
  );
}
