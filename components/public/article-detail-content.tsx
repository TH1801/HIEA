import Image from "next/image";
import Link from "next/link";
import type {
  ArticleDetail,
  ArticleWithCategory,
} from "@/lib/queries/article-queries";
import { formatDate, estimateReadingTime } from "@/lib/utils/format-date";
import { renderTiptapHtml } from "@/lib/tiptap/render-tiptap-html";
import PdfDownloadButton from "@/components/public/pdf-download-button";
import ArticleCard from "@/components/public/article-card";

type BreadcrumbItem = { label: string; href?: string };

/** Category tag colors — solid bg for detail page header */
const TAG_STYLES: Record<string, string> = {
  news: "bg-primary text-white",
  policies: "bg-[#0F3460] text-white",
  events: "bg-accent text-white",
};

/** Article detail — typography-optimized, max-width 800px centered */
export default function ArticleDetailContent({
  article,
  relatedArticles,
  breadcrumbItems,
}: {
  article: ArticleDetail;
  relatedArticles: ArticleWithCategory[];
  breadcrumbItems: BreadcrumbItem[];
}) {
  const categorySlug = article.category?.slug ?? "";
  const tagStyle = TAG_STYLES[categorySlug] ?? "bg-primary text-white";
  const htmlContent = renderTiptapHtml(article.content);
  // Strip HTML tags for accurate word-count reading time estimate
  const plainText = htmlContent.replace(/<[^>]*>/g, "");
  const readTime = estimateReadingTime(plainText || article.excerpt);

  return (
    <article>
      {/* Breadcrumb + header — max-width 800px */}
      <div className="mx-auto max-w-[800px] px-6 pt-8 max-md:px-4">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          {breadcrumbItems.map((item, idx) => (
            <span key={idx}>
              {idx > 0 && <span className="mx-2">→</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="line-clamp-1 text-foreground">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Category tag */}
        {article.category && (
          <span
            className={`inline-block rounded px-3 py-1 text-xs font-semibold ${tagStyle}`}
          >
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <h1 className="mt-4 text-4xl font-bold leading-[1.3] text-foreground max-md:text-2xl">
          {article.title}
        </h1>

        {/* Meta: author · date · read time */}
        <p className="mt-4 text-sm text-muted">
          {article.author?.full_name && <>{article.author.full_name} · </>}
          {formatDate(article.published_at)} · {readTime} phút đọc
        </p>
      </div>

      {/* Featured image */}
      {article.featured_image_url && (
        <div className="mx-auto mt-8 max-w-[800px] px-6 max-md:px-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={article.featured_image_url}
              alt={article.title ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        </div>
      )}

      {/* Article body — prose typography */}
      <div className="mx-auto max-w-[800px] px-6 py-10 max-md:px-4 max-md:py-6">
        {htmlContent ? (
          <div
            className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-[1.8] prose-a:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-surface prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p className="text-muted">Nội dung đang được cập nhật.</p>
        )}
      </div>

      {/* PDF attachment */}
      <div className="mx-auto max-w-[800px] px-6 max-md:px-4">
        <PdfDownloadButton attachmentUrl={article.attachment_url} />
      </div>

      {/* Share section */}
      <div className="mx-auto max-w-[800px] px-6 py-8 max-md:px-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Chia sẻ bài viết
        </h3>
        <div className="flex gap-3">
          <ShareButton label="Facebook">
            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
          </ShareButton>
          <ShareButton label="LinkedIn">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </ShareButton>
          <ShareButton label="Sao chép liên kết" stroke>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </ShareButton>
        </div>
      </div>

      {/* Related articles — wider container */}
      {relatedArticles.length > 0 && (
        <div className="mx-auto max-w-[1200px] px-12 py-12 max-lg:px-6 max-md:px-4 max-md:py-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-7 w-1 rounded-sm bg-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Bài viết liên quan
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/** Small share icon button */
function ShareButton({
  label,
  stroke,
  children,
}: {
  label: string;
  stroke?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface hover:text-primary"
      aria-label={label}
    >
      <svg
        className="h-4 w-4"
        fill={stroke ? "none" : "currentColor"}
        stroke={stroke ? "currentColor" : undefined}
        strokeWidth={stroke ? 2 : undefined}
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </button>
  );
}
