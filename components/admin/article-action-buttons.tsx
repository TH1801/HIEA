"use client";

import { useState, useTransition } from "react";
import { type AdminArticle } from "@/lib/queries/admin-article-queries";
import {
  publishArticle,
  rejectArticle,
  deleteArticle,
} from "@/lib/actions/admin-article-actions";

/**
 * Action buttons per article row — matches .pen design.
 * "Sửa" link (always), "Duyệt" (admin + pending), delete for drafts.
 * Shows error feedback via alert on failure.
 */
export function ArticleActionButtons({
  article,
  userRole,
  userId,
}: {
  article: AdminArticle;
  userRole: "editor" | "admin";
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isAdmin = userRole === "admin";
  const isOwner = article.author_id === userId;
  const canEdit = isAdmin || isOwner;
  const canDelete =
    article.status === "draft" && (isAdmin || isOwner);
  const canApprove = isAdmin && article.status === "pending";
  const canReject = isAdmin && article.status === "pending";

  const handleAction = (action: () => Promise<string | null>) => {
    setError(null);
    startTransition(async () => {
      const err = await action();
      if (err) setError(err);
    });
  };

  const handleDelete = () => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    handleAction(() => deleteArticle(article.id));
  };

  return (
    <div className={`flex items-center gap-3 ${isPending ? "opacity-50" : ""}`}>
      {canEdit && (
        <button className="text-[13px] font-medium text-primary hover:underline">
          Sửa
        </button>
      )}
      {canApprove && (
        <button
          onClick={() => handleAction(() => publishArticle(article.id))}
          disabled={isPending}
          className="text-[13px] font-medium text-primary hover:underline"
        >
          Duyệt
        </button>
      )}
      {canReject && (
        <button
          onClick={() => handleAction(() => rejectArticle(article.id))}
          disabled={isPending}
          className="text-[13px] font-medium text-destructive hover:underline"
        >
          Trả lại
        </button>
      )}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-[13px] font-medium text-destructive hover:underline"
        >
          Xóa
        </button>
      )}
      {article.status === "published" && article.slug && (
        <a
          href={`/tin-tuc/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-muted hover:text-foreground"
        >
          Xem
        </a>
      )}
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
