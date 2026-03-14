import { createClient } from "@/lib/supabase/server";

/** Article row for admin table — includes status, author, category */
export type AdminArticle = {
  id: string;
  title: string | null;
  slug: string | null;
  status: "draft" | "pending" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_id: string | null;
  category: { name: string; slug: string } | null;
  author: { full_name: string | null } | null;
};

/** Count of articles by status */
export type ArticleCounts = {
  all: number;
  draft: number;
  pending: number;
  published: number;
};

const ADMIN_ARTICLE_SELECT =
  "id, title, slug, status, created_at, updated_at, published_at, author_id, category:categories(name, slug), author:profiles(full_name)";

/** Get article counts by status. Admin sees all, editor sees own. */
export async function getArticleCounts(
  userId: string,
  role: "editor" | "admin"
): Promise<ArticleCounts> {
  const supabase = await createClient();

  const statuses = ["draft", "pending", "published"] as const;
  const counts: ArticleCounts = { all: 0, draft: 0, pending: 0, published: 0 };

  for (const status of statuses) {
    let query = supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", status);

    if (role === "editor") {
      query = query.eq("author_id", userId);
    }

    const { count } = await query;
    counts[status] = count ?? 0;
  }

  counts.all = counts.draft + counts.pending + counts.published;
  return counts;
}

/** Get paginated articles for admin. Admin sees all, editor sees own. */
export async function getAdminArticles(
  userId: string,
  role: "editor" | "admin",
  options: {
    status?: "draft" | "pending" | "published";
    page?: number;
    perPage?: number;
  } = {}
): Promise<{ data: AdminArticle[]; count: number }> {
  const { status, page = 1, perPage = 10 } = options;
  const supabase = await createClient();
  const offset = (page - 1) * perPage;

  let query = supabase
    .from("articles")
    .select(ADMIN_ARTICLE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (status) {
    query = query.eq("status", status);
  }

  if (role === "editor") {
    query = query.eq("author_id", userId);
  }

  const { data, count } = await query;
  return {
    data: (data as AdminArticle[] | null) ?? [],
    count: count ?? 0,
  };
}
