import Link from "next/link";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

/** URL-based pagination — "← Trước" + page numbers + "Sau →" */
export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageUrl = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Phân trang">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          ← Trước
        </Link>
      ) : (
        <span className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted opacity-50">
          ← Trước
        </span>
      )}

      {/* Page numbers */}
      {getVisiblePages().map((page) => (
        <Link
          key={page}
          href={pageUrl(page)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary text-white"
              : "border border-border text-foreground hover:bg-surface"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          Sau →
        </Link>
      ) : (
        <span className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted opacity-50">
          Sau →
        </span>
      )}
    </nav>
  );
}
