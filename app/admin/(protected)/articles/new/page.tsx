import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { createArticle } from "@/lib/actions/article-editor-actions";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditorPage } from "@/components/admin/article-editor-page";

/**
 * Create new article page.
 * Auto-creates a draft on load, then renders the editor.
 * Both editor and admin roles can create articles.
 */
export default async function NewArticlePage() {
  const currentUser = await requireRole(["editor", "admin"]);

  // Create draft article immediately
  const { id, error } = await createArticle();
  if (error || !id) {
    redirect("/admin/dashboard");
  }

  const supabase = await createClient();

  // Fetch the actual updated_at from DB (avoids client/server timestamp mismatch)
  const { data: article } = await supabase
    .from("articles")
    .select("updated_at")
    .eq("id", id)
    .single();

  // Fetch categories for dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <ArticleEditorPage
      articleId={id}
      title=""
      content={null}
      categoryId={null}
      status="draft"
      attachmentUrl={null}
      updatedAt={article?.updated_at ?? new Date().toISOString()}
      categories={categories ?? []}
      userRole={currentUser.profile.role}
      viewUrl={null}
    />
  );
}
