import { createClient } from "@/lib/supabase/server";

/** Article row with joined category name */
export type ArticleWithCategory = {
  id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
};

/** Get the latest published article (for hero banner) */
export async function getFeaturedArticle(): Promise<ArticleWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, featured_image_url, published_at, created_at, category:categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  return data as ArticleWithCategory | null;
}

/** Get published articles with optional category filter */
export async function getPublishedArticles(
  limit = 6,
  offset = 0,
  categorySlug?: string
): Promise<ArticleWithCategory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("id, title, slug, excerpt, featured_image_url, published_at, created_at, category:categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data } = await query;
  return (data as ArticleWithCategory[] | null) ?? [];
}

/** Get articles by category slug (for homepage sections) */
export async function getArticlesByCategory(
  categorySlug: string,
  limit = 3
): Promise<ArticleWithCategory[]> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, featured_image_url, published_at, created_at, category:categories(name, slug)")
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as ArticleWithCategory[] | null) ?? [];
}

/** Article with full detail for single-article view */
export type ArticleDetail = {
  id: string;
  title: string | null;
  slug: string | null;
  content: Record<string, unknown> | null;
  excerpt: string | null;
  featured_image_url: string | null;
  attachment_url: string | null;
  category_id: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
  author: { full_name: string | null } | null;
};

/** Paginated published articles with total count */
export async function getPublishedArticlesPaginated(
  page: number,
  perPage: number,
  categorySlugs?: string | string[]
): Promise<{ data: ArticleWithCategory[]; count: number }> {
  const supabase = await createClient();
  const offset = (page - 1) * perPage;

  // Resolve category IDs if filtering
  let categoryIds: string[] | undefined;
  if (categorySlugs) {
    const slugs = Array.isArray(categorySlugs) ? categorySlugs : [categorySlugs];
    const { data: cats } = await supabase
      .from("categories")
      .select("id")
      .in("slug", slugs);
    categoryIds = cats?.map((c) => c.id);
  }

  let query = supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, featured_image_url, published_at, created_at, category:categories(name, slug)",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (categoryIds !== undefined) {
    if (categoryIds.length === 0) {
      return { data: [], count: 0 };
    }
    query = query.in("category_id", categoryIds);
  }

  const { data, count } = await query;
  return {
    data: (data as ArticleWithCategory[] | null) ?? [],
    count: count ?? 0,
  };
}

/** Get single published article by slug with full content */
export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "id, title, slug, content, excerpt, featured_image_url, attachment_url, category_id, published_at, created_at, category:categories(name, slug), author:profiles(full_name)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1)
    .single();

  return data as ArticleDetail | null;
}

/** Get related articles in same category, excluding current */
export async function getRelatedArticles(
  categoryId: string,
  excludeId: string,
  limit = 3
): Promise<ArticleWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, featured_image_url, published_at, created_at, category:categories(name, slug)"
    )
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as ArticleWithCategory[] | null) ?? [];
}
