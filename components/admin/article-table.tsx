"use client";

import { type AdminArticle } from "@/lib/queries/admin-article-queries";
import { ArticleStatusBadge } from "./article-status-badge";
import { ArticleActionButtons } from "./article-action-buttons";

/**
 * Admin article table — matches .pen design exactly.
 * Columns: Tiêu đề | Danh mục | Trạng thái | Ngày tạo | Thao tác
 * Responsive: card layout on mobile/tablet without sidebar.
 */
export function ArticleTable({
  articles,
  userRole,
  userId,
}: {
  articles: AdminArticle[];
  userRole: "editor" | "admin";
  userId: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        Chưa có bài viết nào.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop table */}
      <table className="hidden w-full lg:table">
        <thead>
          <tr className="rounded-t-md bg-surface text-left text-[13px] font-semibold text-muted">
            <th className="w-[420px] rounded-tl-md px-4 py-3">Tiêu đề</th>
            <th className="w-[140px] px-4 py-3">Danh mục</th>
            <th className="w-[140px] px-4 py-3">Trạng thái</th>
            <th className="w-[140px] px-4 py-3">Ngày tạo</th>
            <th className="rounded-tr-md px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              className="border-b border-border text-sm"
            >
              <td className="px-4 py-4">
                <span className="font-medium text-foreground line-clamp-1">
                  {article.title || "Chưa có tiêu đề"}
                </span>
              </td>
              <td className="px-4 py-4 text-foreground">
                {article.category?.name || "—"}
              </td>
              <td className="px-4 py-4">
                <ArticleStatusBadge status={article.status} />
              </td>
              <td className="px-4 py-4 text-muted">
                {formatDate(article.created_at)}
              </td>
              <td className="px-4 py-4">
                <ArticleActionButtons
                  article={article}
                  userRole={userRole}
                  userId={userId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile/Tablet card layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        {articles.map((article) => (
          <div
            key={article.id}
            className="rounded-lg border border-border p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="font-medium text-foreground line-clamp-2 text-sm">
                {article.title || "Chưa có tiêu đề"}
              </span>
              <ArticleStatusBadge status={article.status} />
            </div>
            <div className="mb-3 flex items-center gap-3 text-xs text-muted">
              <span>{article.category?.name || "—"}</span>
              <span>·</span>
              <span>{formatDate(article.created_at)}</span>
            </div>
            <ArticleActionButtons
              article={article}
              userRole={userRole}
              userId={userId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Format ISO date to dd/mm/yyyy */
function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
