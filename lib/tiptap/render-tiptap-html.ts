import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

/**
 * Shared TipTap extensions — same list must be used by both
 * this renderer (Phase 5) and the editor (Phase 7).
 */
const extensions = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: false }),
];

/** Convert TipTap JSON content to HTML string (server-side only) */
export function renderTiptapHtml(
  content: Record<string, unknown> | null
): string {
  if (!content) return "";
  try {
    return generateHTML(content as JSONContent, extensions);
  } catch {
    return "<p>Nội dung không khả dụng.</p>";
  }
}
