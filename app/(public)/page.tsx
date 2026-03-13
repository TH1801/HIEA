import type { Metadata } from "next";
import {
  getFeaturedArticle,
  getPublishedArticles,
  getArticlesByCategory,
} from "@/lib/queries/article-queries";
import HeroBanner from "@/components/public/hero-banner";
import ArticleGrid from "@/components/public/article-grid";
import CategoryListSection from "@/components/public/category-list-section";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Trang chủ | HIEA - Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh",
  description:
    "Tin tức, chính sách và sự kiện mới nhất từ Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh.",
};

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredArticle, latestArticles, policyArticles, newsEventArticles] =
    await Promise.all([
      getFeaturedArticle(),
      getPublishedArticles(6),
      getArticlesByCategory("policies", 3),
      getArticlesByCategory("events", 3),
    ]);

  return (
    <>
      {/* Hero Banner — featured article */}
      <HeroBanner article={featuredArticle} />

      {/* Section divider */}
      <div className="mx-auto max-w-[1440px] px-12 max-lg:px-6 max-md:px-4">
        <div className="h-px bg-border" />
      </div>

      {/* Latest News Grid — 3-col, 2 rows */}
      <div className="py-12 max-md:py-8">
        <ArticleGrid
          title="Tin tức mới nhất"
          viewAllHref="/news"
          articles={latestArticles}
        />
      </div>

      {/* Policy Section — compact list on surface bg */}
      <CategoryListSection
        title="Chính sách"
        viewAllHref="/policies"
        articles={policyArticles}
      />

      {/* News & Events Section — compact list, no bg (shares surface from above) */}
      <CategoryListSection
        title="Tin tức & Sự kiện"
        viewAllHref="/news"
        articles={newsEventArticles}
        showBackground={false}
      />

      {/* Gradient transition to footer */}
      <div className="h-[100px] bg-gradient-to-b from-background to-surface max-md:h-20" />
    </>
  );
}
