"use client";

import { useRef, useState } from "react";
import { CloudUpload, File, X } from "lucide-react";
import { uploadAttachment, removeAttachment } from "@/lib/actions/article-editor-actions";

interface FileAttachmentUploadProps {
  articleId: string;
  initialUrl: string | null;
  onUploaded: (url: string | null) => void;
}

/**
 * File attachment upload — drag-and-drop zone matching .pen design.
 * Dashed border, centered icon+text, accepts PDF/DOCX/images, 20MB max.
 */
export function FileAttachmentUpload({
  articleId,
  initialUrl,
  onUploaded,
}: FileAttachmentUploadProps) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 20 * 1024 * 1024) {
      setError("Tệp quá lớn (tối đa 20MB).");
      return;
    }
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadAttachment(formData);

    setUploading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setUrl(result.url);
      onUploaded(result.url);
    }
  }

  async function handleRemove() {
    if (!url) return;
    const err = await removeAttachment(articleId, url);
    if (err) {
      setError(err);
    } else {
      setUrl(null);
      onUploaded(null);
    }
  }

  // Show uploaded file state
  if (url) {
    const filename = url.split("/").pop() ?? "attachment";
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <File size={20} className="shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
          {filename}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label="Xóa tệp"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`flex h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors ${
          dragOver ? "border-primary bg-blue-50" : "border-border"
        }`}
      >
        {uploading ? (
          <span className="text-sm text-muted-foreground">Đang tải lên...</span>
        ) : (
          <>
            <CloudUpload size={28} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">
              Kéo thả hoặc nhấn để tải lên
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              Đính kèm tệp (PDF, DOCX, hình ảnh)
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
