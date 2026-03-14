"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { ChevronDown } from "lucide-react";
import { editorExtensions } from "@/lib/tiptap/editor-extensions";
import { updateArticle, submitForReview } from "@/lib/actions/article-editor-actions";
import { publishArticle, rejectArticle, deleteArticle } from "@/lib/actions/admin-article-actions";
import { SaveStatusIndicator, type SaveStatus } from "./save-status-indicator";
import { TiptapToolbar } from "./tiptap-toolbar";
import { TiptapSlashCommand } from "./tiptap-slash-command";
import { FileAttachmentUpload } from "./file-attachment-upload";

interface Category {
  id: string;
  name: string;
}

interface TiptapEditorProps {
  articleId: string;
  initialTitle: string;
  initialContent: JSONContent | null;
  initialCategoryId: string | null;
  initialStatus: "draft" | "pending" | "published";
  initialAttachmentUrl: string | null;
  initialUpdatedAt: string;
  categories: Category[];
  userRole: "editor" | "admin";
  viewUrl: string | null;
}

/**
 * Notion-style editor — borderless title, floating toolbar, slash commands,
 * debounced auto-save (3s), role-based actions, published read-only mode.
 */
export function TiptapEditor({
  articleId,
  initialTitle,
  initialContent,
  initialCategoryId,
  initialStatus,
  initialAttachmentUrl,
  initialUpdatedAt,
  categories,
  userRole,
  viewUrl,
}: TiptapEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "");
  const [status, setStatus] = useState(initialStatus);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const updatedAtRef = useRef(initialUpdatedAt);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for latest values — avoids stale closures in debounced auto-save
  const titleRef = useRef(title);
  titleRef.current = title;
  const categoryIdRef = useRef(categoryId);
  categoryIdRef.current = categoryId;
  const doSaveRef = useRef<(() => Promise<void>) | null>(null);

  const isPublished = status === "published";

  /** Debounced auto-save — 3s after last keystroke */
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSaveRef.current?.(), 3000);
  }, []);

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    immediatelyRender: false,
    editable: !isPublished,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: () => {
      if (!isPublished) scheduleSave();
    },
  });

  /** Save current editor state to server */
  const doSave = useCallback(async () => {
    if (!editor || isPublished) return;
    setSaveStatus("saving");

    const result = await updateArticle(articleId, {
      title: titleRef.current,
      content: editor.getJSON() as Record<string, unknown>,
      category_id: categoryIdRef.current || undefined,
      updated_at: updatedAtRef.current,
    });

    if (result.conflict) {
      setSaveStatus("conflict");
    } else if (result.error) {
      setSaveStatus("error");
    } else {
      setSavedAt(new Date());
      if (result.updated_at) updatedAtRef.current = result.updated_at;
      setSaveStatus("saved");
    }
  }, [editor, articleId, isPublished]);
  doSaveRef.current = doSave;

  // Sync editor editability when status changes (e.g. after inline publish)
  useEffect(() => {
    if (editor) editor.setEditable(!isPublished);
  }, [editor, isPublished]);

  // Cleanup save timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Trigger save on title/category change (debounced)
  useEffect(() => {
    if (isPublished) return;
    if (title !== initialTitle || categoryId !== (initialCategoryId ?? "")) {
      scheduleSave();
    }
  }, [title, categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    if (!categoryId) {
      setCategoryError(true);
      alert("Vui lòng chọn danh mục trước khi gửi duyệt.");
      return;
    }
    setCategoryError(false);
    setSubmitting(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await doSave();
    const err = await submitForReview(articleId);
    if (err) {
      alert(err);
    } else {
      setStatus("pending");
    }
    setSubmitting(false);
  }

  async function handlePublish() {
    setSubmitting(true);
    const err = await publishArticle(articleId);
    if (err) alert(err);
    else setStatus("published");
    setSubmitting(false);
  }

  async function handleReject() {
    setSubmitting(true);
    const err = await rejectArticle(articleId);
    if (err) alert(err);
    else setStatus("draft");
    setSubmitting(false);
  }

  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    setSubmitting(true);
    const err = await deleteArticle(articleId);
    if (err) {
      alert(err);
      setSubmitting(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  const statusLabels: Record<string, { text: string; cls: string }> = {
    draft: { text: "Bản nháp", cls: "bg-gray-100 text-gray-600" },
    pending: { text: "Chờ duyệt", cls: "bg-amber-50 text-amber-700" },
    published: { text: "Đã xuất bản", cls: "bg-emerald-50 text-emerald-700" },
  };
  const badge = statusLabels[status] ?? statusLabels.draft;

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar — breadcrumb + status */}
      <div className="flex items-center justify-between border-b border-border px-10 py-4">
        <span className="text-[13px] text-muted-foreground">
          Quản lý Bài viết → {isPublished ? "Xem" : "Chỉnh sửa"}
        </span>
        {isPublished ? (
          <span className="text-[13px] text-muted-foreground">Chỉ xem</span>
        ) : (
          <SaveStatusIndicator status={saveStatus} savedAt={savedAt} />
        )}
      </div>

      {/* Editor Content Area */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1384px] flex-col gap-8 px-20 py-10">
          {/* Meta Row — category dropdown + status badge */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setCategoryError(false); }}
                disabled={isPublished}
                className={`appearance-none rounded-md border bg-transparent py-1.5 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${categoryError ? "border-destructive" : "border-border"} ${isPublished ? "cursor-default opacity-70" : ""}`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            <span className={`rounded px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
              {badge.text}
            </span>
          </div>

          {/* Title — borderless H1 input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                editor?.commands.focus("start");
              }
            }}
            readOnly={isPublished}
            placeholder="Nhập tiêu đề bài viết..."
            className={`w-full border-0 bg-transparent text-4xl font-bold leading-tight text-foreground placeholder:text-muted-foreground focus:outline-none ${isPublished ? "cursor-default" : ""}`}
          />

          {/* TipTap content with floating toolbar + slash commands */}
          <div className="relative">
            {editor && !isPublished && <TiptapToolbar editor={editor} />}
            {editor && !isPublished && <TiptapSlashCommand editor={editor} />}
            <EditorContent editor={editor} />
          </div>

          {/* File attachment — hidden for published */}
          {!isPublished && (
            <FileAttachmentUpload
              articleId={articleId}
              initialUrl={initialAttachmentUrl}
              onUploaded={(url) => {
                if (url) {
                  updateArticle(articleId, { updated_at: updatedAtRef.current });
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Action Bar — role-based buttons */}
      <div className="flex items-center justify-between border-t border-border px-10 py-4">
        <div className="flex items-center gap-3">
          {isPublished ? (
            <>
              {viewUrl && (
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-border bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary-hover"
                >
                  Xem bài viết
                </a>
              )}
              {userRole === "admin" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="rounded-md border border-destructive bg-white px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Xoá
                </button>
              )}
            </>
          ) : (
            <>
              {(userRole === "editor" || (userRole === "admin" && status === "draft")) && (
                <>
                  <button
                    type="button"
                    onClick={() => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); doSave(); }}
                    className="rounded-md border border-border bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary-hover"
                  >
                    Lưu bản nháp
                  </button>
                  {status === "draft" && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                      Gửi duyệt
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Right: Admin role buttons (pending only) */}
        <div className="flex items-center gap-3">
          {userRole === "admin" && status === "pending" && (
            <>
              <button
                type="button"
                onClick={handlePublish}
                disabled={submitting}
                className="rounded-md bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
              >
                Xuất bản
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={submitting}
                className="rounded-md border border-destructive bg-white px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Trả lại
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
