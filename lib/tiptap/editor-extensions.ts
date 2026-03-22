import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

/**
 * Base extensions shared by editor and server-side renderer.
 * StarterKit includes: headings, bold, italic, lists, code block, blockquote, etc.
 */
const baseExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Image.configure({}),
  Link.configure({ openOnClick: false }),
  Highlight,
  Underline,
];

/** Full editor extensions — base + editor-only Placeholder */
export const editorExtensions = [
  ...baseExtensions,
  Placeholder.configure({
    placeholder: "Bắt đầu viết nội dung...",
  }),
];

/** Extensions for server-side HTML rendering (no editor-only Placeholder) */
export const renderExtensions = baseExtensions;
