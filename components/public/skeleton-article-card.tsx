/**
 * Skeleton loading state for ArticleCard component.
 * Matches Variant B from .pen design: shimmer image + tag + title + excerpt + date.
 * Renders a single card; use SkeletonArticleGrid for 3-column layout.
 */
export function SkeletonArticleCard() {
  return (
    <div role="status" aria-label="Đang tải bài viết" className="animate-pulse overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Image shimmer — 200px height */}
      <div className="h-[200px] w-full bg-border" />

      {/* Body — matches ArticleCard padding & gap */}
      <div className="flex flex-col gap-3 p-5">
        <div className="h-6 w-[60px] rounded-sm bg-border" />
        <div className="h-[18px] w-full rounded-sm bg-border" />
        <div className="h-[18px] w-[200px] rounded-sm bg-border" />
        <div className="h-3.5 w-full rounded-sm bg-border" />
        <div className="h-3.5 w-[260px] rounded-sm bg-border" />
        <div className="mt-2 h-3 w-[100px] rounded-sm bg-border" />
      </div>
    </div>
  );
}

/**
 * 3-column grid of skeleton article cards — matches news grid layout.
 * @param count - Number of skeleton cards to render (default 6)
 */
export function SkeletonArticleGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonArticleCard key={i} />
      ))}
    </div>
  );
}
