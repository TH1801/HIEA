/** Status badge colors matching .pen design exactly */
const BADGE_STYLES = {
  published: { bg: "bg-[#DEF7EC]", text: "text-[#03543F]", label: "Đã xuất bản" },
  pending: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", label: "Chờ duyệt" },
  draft: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", label: "Bản nháp" },
} as const;

/**
 * Pill-shaped status badge for articles.
 * Colors: Published=green, Pending=amber, Draft=gray.
 */
export function ArticleStatusBadge({
  status,
}: {
  status: "draft" | "pending" | "published";
}) {
  const style = BADGE_STYLES[status];

  return (
    <span
      className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
