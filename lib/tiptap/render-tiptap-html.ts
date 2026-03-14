import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { editorExtensions } from "./editor-extensions";

/** Convert TipTap JSON content to HTML string (server-side only) */
export function renderTiptapHtml(
  content: Record<string, unknown> | null
): string {
  if (!content) return "";
  try {
    return generateHTML(content as JSONContent, editorExtensions);
  } catch {
    return "<p>Nội dung không khả dụng.</p>";
  }
}
