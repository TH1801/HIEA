import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

/**
 * Shared TipTap extensions used by both editor (Phase 7) and renderer.
 * StarterKit includes: headings, bold, italic, lists, code block, blockquote, etc.
 */
export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Image,
  Link.configure({ openOnClick: false }),
  Placeholder.configure({
    placeholder: "Bắt đầu viết nội dung...",
  }),
  Highlight,
  Underline,
];
