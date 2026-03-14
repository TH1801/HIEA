import Link from "next/link";

/**
 * Empty state — shown when a list/section has no content.
 * Matches .pen design: circle illustration + heading + description + CTA.
 * Used within (public) layout which already provides header/footer.
 */
export default function EmptyStateContent({
  heading = "Chưa có bài viết nào",
  description = "Nội dung đang được cập nhật. Vui lòng quay lại sau.",
}: {
  heading?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-12 py-[120px] max-lg:px-6 max-lg:py-20 max-md:px-4 max-md:py-16">
      {/* Illustration — 128px circle with document icon */}
      <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-border bg-surface">
        <svg
          aria-hidden="true"
          className="h-12 w-12 text-muted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>

      {/* Heading — 28px bold */}
      <h3 className="text-[28px] font-bold text-foreground">{heading}</h3>

      {/* Description — 16px muted, centered, max-width 420px */}
      <p className="max-w-[420px] text-center text-base text-muted">{description}</p>

      {/* CTA button */}
      <Link
        href="/"
        className="flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Về Trang chủ
      </Link>
    </div>
  );
}
