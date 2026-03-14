/**
 * Skeleton loading state for compact list items (CategoryListSection).
 * Matches Variant C from .pen design: thumbnail 80x60 + title line + date line.
 */
export function SkeletonListItem({ showBorder = true }: { showBorder?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Đang tải mục"
      className={`flex animate-pulse items-center gap-4 ${
        showBorder ? "border-b border-border pb-4" : ""
      }`}
    >
      {/* Thumbnail shimmer — 80x60px */}
      <div className="h-[60px] w-[80px] shrink-0 rounded-md bg-border" />

      {/* Text group */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-full rounded-sm bg-border" />
        <div className="h-3 w-[120px] rounded-sm bg-border" />
      </div>
    </div>
  );
}

/**
 * Vertical list of skeleton list items — matches category list section.
 * @param count - Number of skeleton items (default 4)
 */
export function SkeletonListGroup({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonListItem key={i} showBorder={i < count - 1} />
      ))}
    </div>
  );
}
