"use client";

import dynamic from "next/dynamic";
import type { JSONContent } from "@tiptap/core";

/** Dynamic import TipTap editor — client-only, no SSR */
const TiptapEditor = dynamic(
  () => import("./tiptap-editor").then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-muted-foreground">Đang tải trình soạn thảo...</span>
      </div>
    ),
  }
);

interface ArticleEditorPageProps {
  articleId: string;
  title: string;
  content: JSONContent | null;
  categoryId: string | null;
  status: "draft" | "pending" | "published";
  attachmentUrl: string | null;
  updatedAt: string;
  categories: { id: string; name: string }[];
  userRole: "editor" | "admin";
  viewUrl: string | null;
}

/**
 * Editor page wrapper — handles dynamic import of TipTap.
 * Receives data from server component and passes to client editor.
 */
export function ArticleEditorPage(props: ArticleEditorPageProps) {
  return (
    <div className="flex h-screen flex-col lg:h-full">
      <TiptapEditor
        articleId={props.articleId}
        initialTitle={props.title}
        initialContent={props.content}
        initialCategoryId={props.categoryId}
        initialStatus={props.status}
        initialAttachmentUrl={props.attachmentUrl}
        initialUpdatedAt={props.updatedAt}
        categories={props.categories}
        userRole={props.userRole}
        viewUrl={props.viewUrl}
      />
    </div>
  );
}
