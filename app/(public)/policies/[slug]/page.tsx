import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/queries/article-queries";
import ArticleDetailContent from "@/components/public/article-detail-content";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Không tìm thấy | HIEA" };

  return {
    title: `${article.title} | HIEA`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title ?? undefined,
      description: article.excerpt ?? undefined,
      images: article.featured_image_url
        ? [article.featured_image_url]
        : undefined,
    },
  };
}

export default async function PolicyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  // 404 if not found or category doesn't match route (prevent cross-route access)
  if (!article || article.category?.slug !== "policies") notFound();

  const relatedArticles = article.category_id
    ? await getRelatedArticles(article.category_id, article.id, 3)
    : [];

  return (
    <ArticleDetailContent
      article={article}
      relatedArticles={relatedArticles}
      breadcrumbItems={[
        { label: "Trang chủ", href: "/" },
        { label: "Chính sách & Quy định", href: "/policies" },
        { label: article.title ?? "" },
      ]}
    />
  );
}
