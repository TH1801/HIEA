import type { Metadata } from "next";
import { getPublishedArticlesPaginated } from "@/lib/queries/article-queries";
import ArticleListPage from "@/components/public/article-list-page";

export const revalidate = 3600;

const ARTICLES_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Chính sách & Quy định | HIEA",
  description:
    "Chính sách, quy định xuất nhập khẩu và văn bản pháp luật mới nhất.",
};

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { data: articles, count } = await getPublishedArticlesPaginated(
    currentPage,
    ARTICLES_PER_PAGE,
    "policies"
  );

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  return (
    <ArticleListPage
      title="Chính sách & Quy định"
      description="Chính sách, quy định xuất nhập khẩu và văn bản pháp luật mới nhất."
      breadcrumbItems={[
        { label: "Trang chủ", href: "/" },
        { label: "Chính sách & Quy định" },
      ]}
      articles={articles}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/policies"
    />
  );
}
