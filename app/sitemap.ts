import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://hiea.org.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/policies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Dynamic article pages
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at, category:categories(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => {
    const categorySlug = (article.category as { slug: string } | null)?.slug;
    const basePath = categorySlug === "policies" ? "/policies" : "/news";
    return {
      url: `${BASE_URL}${basePath}/${article.slug}`,
      lastModified: article.published_at ? new Date(article.published_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
