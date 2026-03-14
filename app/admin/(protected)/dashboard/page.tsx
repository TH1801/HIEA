import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminArticles } from "@/lib/queries/admin-article-queries";
import { ArticleFilterTabs } from "@/components/admin/article-filter-tabs";
import { ArticleTable } from "@/components/admin/article-table";
import { AdminPagination } from "@/components/admin/admin-pagination";

/**
 * Admin dashboard — article management view.
 * Matches .pen "Admin Dashboard Desktop 1440" layout exactly.
 * URL: /admin/dashboard?status=pending&page=1
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const currentUser = await requireRole(["editor", "admin"]);
  const params = await searchParams;

  const status = ["draft", "pending", "published"].includes(params.status ?? "")
    ? (params.status as "draft" | "pending" | "published")
    : undefined;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const perPage = 10;

  const { data: articles, count } = await getAdminArticles(
    currentUser.id,
    currentUser.profile.role,
    { status, page, perPage }
  );

  const totalPages = Math.ceil(count / perPage);

  // Build search params for pagination (preserve status filter)
  const paginationParams: Record<string, string> = {};
  if (status) paginationParams.status = status;

  return (
    <div className="flex flex-col gap-6 px-5 py-6 lg:px-10 lg:py-8">
      {/* Top bar: heading + create button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground lg:text-[28px]">
          Quản lý Bài viết
        </h1>
        <Link
          href="/admin/articles/new"
          className="flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white hover:bg-primary-hover"
        >
          + Tạo bài viết mới
        </Link>
      </div>

      {/* Filter tabs */}
      <ArticleFilterTabs currentStatus={status} />

      {/* Article table */}
      <ArticleTable
        articles={articles}
        userRole={currentUser.profile.role}
        userId={currentUser.id}
      />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/dashboard"
        searchParams={paginationParams}
      />
    </div>
  );
}
