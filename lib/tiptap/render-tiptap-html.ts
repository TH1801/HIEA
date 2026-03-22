import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { renderExtensions } from "./editor-extensions";

/** Convert TipTap JSON content to HTML string (server-side only) */
export function renderTiptapHtml(
  content: Record<string, unknown> | null
): string {
  if (!content) return "";
  try {
    // DEBUG: Check if content JSON contains image nodes
    const json = JSON.stringify(content);
    const hasImageNodes = json.includes('"type":"image"') || json.includes('"type": "image"');
    if (hasImageNodes) {
      console.log("[renderTiptapHtml] Content contains image nodes");
    }

    const html = generateHTML(content as JSONContent, renderExtensions);

    // DEBUG: Check if generated HTML contains img tags
    if (hasImageNodes) {
      const hasImgTags = html.includes("<img");
      console.log(`[renderTiptapHtml] Generated HTML contains <img>: ${hasImgTags}`);
      if (!hasImgTags) {
        console.log("[renderTiptapHtml] WARNING: Image nodes in JSON but no <img> in HTML!");
        console.log("[renderTiptapHtml] Extensions count:", renderExtensions.length);
      }
    }

    return html;
  } catch (err) {
    console.error("[renderTiptapHtml] Error:", err);
    return "<p>Nội dung không khả dụng.</p>";
  }
}
