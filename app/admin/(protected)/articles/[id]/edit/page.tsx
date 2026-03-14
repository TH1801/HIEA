import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditorPage } from "@/components/admin/article-editor-page";
import type { JSONContent } from "@tiptap/core";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit article page.
 * Editor can only edit own drafts. Admin can edit any article.
 */
export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const currentUser = await requireRole(["editor", "admin"]);

  const supabase = await createClient();

  // Fetch article
  const { data: article } = await supabase
    .from("articles")
    .select("id, title, content, category_id, status, attachment_url, updated_at, author_id, slug")
    .eq("id", id)
    .single();

  if (!article) return notFound();

  // Editor can only edit own drafts
  if (currentUser.profile.role === "editor") {
    if (article.author_id !== currentUser.id || article.status !== "draft") {
      redirect("/admin/dashboard");
    }
  }

  // Fetch categories for dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  // Compute view URL for published articles
  let viewUrl: string | null = null;
  if (article.status === "published" && article.slug) {
    const cat = categories?.find((c: { id: string; slug?: string }) => c.id === article.category_id);
    const basePath = cat?.slug === "policies" ? "/policies" : "/news";
    viewUrl = `${basePath}/${article.slug}`;
  }

  return (
    <ArticleEditorPage
      articleId={article.id}
      title={article.title ?? ""}
      content={(article.content as JSONContent) ?? null}
      categoryId={article.category_id}
      status={article.status}
      attachmentUrl={article.attachment_url}
      updatedAt={article.updated_at}
      categories={categories ?? []}
      userRole={currentUser.profile.role}
      viewUrl={viewUrl}
    />
  );
}
