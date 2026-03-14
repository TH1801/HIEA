import Link from "next/link";

/**
 * Admin pagination — matches .pen design.
 * "← Trước" + page numbers (32x32) + "Sau →"
 * Active page: primary bg + white text.
 */
export function AdminPagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      className="flex items-center justify-center gap-2 py-4"
      aria-label="Phân trang"
    >
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="text-sm text-muted hover:text-foreground"
        >
          ← Trước
        </Link>
      ) : (
        <span className="text-sm text-muted opacity-50">← Trước</span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium ${
            page === currentPage
              ? "bg-primary text-white"
              : "text-foreground hover:bg-surface"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="text-sm text-primary hover:underline"
        >
          Sau →
        </Link>
      ) : (
        <span className="text-sm text-muted opacity-50">Sau →</span>
      )}
    </nav>
  );
}
