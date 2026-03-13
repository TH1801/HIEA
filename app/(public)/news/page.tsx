import type { Metadata } from "next";
import { getPublishedArticlesPaginated } from "@/lib/queries/article-queries";
import ArticleListPage from "@/components/public/article-list-page";

export const revalidate = 3600;

const ARTICLES_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện | HIEA",
  description:
    "Cập nhật tin tức, sự kiện mới nhất từ Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { data: articles, count } = await getPublishedArticlesPaginated(
    currentPage,
    ARTICLES_PER_PAGE,
    ["news", "events"]
  );

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  return (
    <ArticleListPage
      title="Tin tức & Sự kiện"
      description="Cập nhật tin tức, sự kiện mới nhất từ Hiệp hội Xuất Nhập khẩu TP. Hồ Chí Minh."
      breadcrumbItems={[
        { label: "Trang chủ", href: "/" },
        { label: "Tin tức & Sự kiện" },
      ]}
      articles={articles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/news"
    />
  );
}
