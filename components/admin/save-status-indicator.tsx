"use client";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "conflict";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  savedAt: Date | null;
}

/**
 * Auto-save status display — matches .pen design top bar.
 * Green checkmark "✓ Đã lưu tự động lúc HH:mm" when saved.
 */
export function SaveStatusIndicator({ status, savedAt }: SaveStatusIndicatorProps) {
  const timeStr = savedAt
    ? savedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "";

  switch (status) {
    case "saving":
      return <span className="text-[13px] text-muted-foreground">Đang lưu...</span>;
    case "saved":
      return (
        <span className="text-[13px] font-medium text-emerald-500">
          ✓ Đã lưu tự động lúc {timeStr}
        </span>
      );
    case "error":
      return <span className="text-[13px] text-destructive">Lỗi lưu bài</span>;
    case "conflict":
      return (
        <span className="text-[13px] text-amber-600">
          ⚠ Bài viết đã được chỉnh sửa bởi người khác
        </span>
      );
    default:
      return null;
  }
}
