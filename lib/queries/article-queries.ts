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
