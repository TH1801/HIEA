"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Heading2, Heading3, Link, List, ListOrdered, Quote,
  Underline as UnderlineIcon,
} from "lucide-react";

interface TiptapToolbarProps {
  editor: Editor;
}

/**
 * Floating selection toolbar — matches .pen design.
 * Dark bg (#1F2937), rounded-md, shadow, appears on text selection.
 * Items: B, I, U, Link, H2, H3, BulletList, OrderedList, Quote.
 */
export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      setCoords(null);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0 || domSelection.isCollapsed) {
      setCoords(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setCoords(null);
      return;
    }

    const toolbarWidth = toolbarRef.current?.offsetWidth ?? 320;

    // Fixed positioning with viewport coords — immune to overflow:auto clipping
    setCoords({
      top: Math.max(8, rect.top - 48),
      left: Math.max(8, Math.min(
        window.innerWidth - toolbarWidth - 8,
        rect.left + rect.width / 2 - toolbarWidth / 2
      )),
    });
  }, [editor]);

  const hideToolbar = useCallback(() => setCoords(null), []);

  useEffect(() => {
    editor.on("selectionUpdate", updatePosition);
    editor.on("blur", hideToolbar);
    editor.on("focus", updatePosition);

    const editorEl = editor.view.dom;
    const handleMouseUp = () => setTimeout(updatePosition, 10);
    editorEl.addEventListener("mouseup", handleMouseUp);

    // Reposition on scroll — fixed-positioned toolbar must track the selection
    const handleScroll = () => requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("blur", hideToolbar);
      editor.off("focus", updatePosition);
      editorEl.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [editor, updatePosition, hideToolbar]);

  if (!coords) return null;

  const btn = (active: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded transition-colors ${
      active ? "bg-white/20" : "hover:bg-white/10"
    }`;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 rounded-md bg-[#1F2937] px-2 py-1.5 shadow-lg"
      style={{ top: coords.top, left: coords.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
        title="Bold"
      >
        <span className="text-sm font-bold text-white">B</span>
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
        title="Italic"
      >
        <span className="text-sm italic text-white">I</span>
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive("underline"))}
        title="Underline"
      >
        <UnderlineIcon size={16} className="text-white" />
      </button>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={btn(editor.isActive("link"))}
        title="Link"
      >
        <Link size={16} className="text-white" />
      </button>

      {/* Separator */}
      <div className="mx-0.5 h-4 w-px bg-white/20" />

      {/* H2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={16} className="text-white" />
      </button>

      {/* H3 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 size={16} className="text-white" />
      </button>

      {/* Separator */}
      <div className="mx-0.5 h-4 w-px bg-white/20" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={16} className="text-white" />
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
        title="Ordered List"
      >
        <ListOrdered size={16} className="text-white" />
      </button>

      {/* Blockquote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <Quote size={16} className="text-white" />
      </button>
    </div>
  );
}
