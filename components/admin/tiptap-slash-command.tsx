"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import type { Editor } from "@tiptap/react";
import {
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Image as ImageIcon, Link2,
} from "lucide-react";
import { uploadEditorImage } from "@/lib/actions/article-editor-actions";

interface SlashMenuItem {
  label: string;
  icon: React.ReactNode;
  action: (editor: Editor) => void;
}

const UPLOAD_PLACEHOLDER = "Đang tải ảnh...";

const BASE_SLASH_ITEMS: SlashMenuItem[] = [
  {
    label: "Heading 1",
    icon: <Heading1 size={18} />,
    action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Heading 2",
    icon: <Heading2 size={18} />,
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Heading 3",
    icon: <Heading3 size={18} />,
    action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Bullet List",
    icon: <List size={18} />,
    action: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Ordered List",
    icon: <ListOrdered size={18} />,
    action: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Blockquote",
    icon: <Quote size={18} />,
    action: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Code Block",
    icon: <Code size={18} />,
    action: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    label: "Divider",
    icon: <Minus size={18} />,
    action: (e) => e.chain().focus().setHorizontalRule().run(),
  },
];

interface TiptapSlashCommandProps {
  editor: Editor;
}

/**
 * Slash command menu — triggered by "/" keystroke.
 * Filterable, keyboard navigable (arrow keys + enter).
 */
export function TiptapSlashCommand({ editor }: TiptapSlashCommandProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use refs to avoid stale closure in keydown handler
  // IMPORTANT: openRef is updated synchronously in show/close helpers, NOT during render,
  // to prevent timing gaps where Enter key gets intercepted after menu closes.
  const openRef = useRef(false);
  const filterRef = useRef(filter);
  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => { filterRef.current = filter; }, [filter]);
  useEffect(() => { selectedIndexRef.current = selectedIndex; }, [selectedIndex]);

  // Handle image file upload: insert placeholder → upload → replace with image
  const handleImageUpload = useCallback(async (file: File) => {
    editor.chain().focus().insertContent(UPLOAD_PLACEHOLDER).run();

    const formData = new FormData();
    formData.append("file", file);
    const { url, error } = await uploadEditorImage(formData);

    // Find and remove placeholder from editor
    const { doc } = editor.state;
    let from = -1;
    let to = -1;
    doc.descendants((node, pos) => {
      if (from >= 0) return false;
      if (node.isText && node.text?.includes(UPLOAD_PLACEHOLDER)) {
        const idx = node.text.indexOf(UPLOAD_PLACEHOLDER);
        from = pos + idx;
        to = from + UPLOAD_PLACEHOLDER.length;
        return false;
      }
    });
    if (from >= 0) {
      editor.chain().deleteRange({ from, to }).run();
    }

    if (error || !url) {
      alert(error || "Lỗi khi tải ảnh lên.");
      return;
    }
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  // Extend base items with image upload and image URL commands
  const slashItems = useMemo<SlashMenuItem[]>(() => [
    ...BASE_SLASH_ITEMS,
    {
      label: "Upload Image",
      icon: <ImageIcon size={18} />,
      action: () => fileInputRef.current?.click(),
    },
    {
      label: "Image URL",
      icon: <Link2 size={18} />,
      action: (e) => {
        const url = window.prompt("Nhập URL ảnh:");
        if (!url) return;
        try {
          const parsed = new URL(url);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            alert("URL không hợp lệ. Chỉ chấp nhận http/https.");
            return;
          }
          e.chain().focus().setImage({ src: url }).run();
        } catch {
          alert("URL không hợp lệ.");
        }
      },
    },
  ], []);

  const filtered = slashItems.filter((item) =>
    item.label.toLowerCase().includes(filter.toLowerCase())
  );
  const filteredRef = useRef(filtered);
  useEffect(() => { filteredRef.current = filtered; }, [filtered]);

  const close = useCallback(() => {
    openRef.current = false; // sync ref immediately to prevent Enter interception
    setOpen(false);
    setFilter("");
    setSelectedIndex(0);
  }, []);

  const executeItem = useCallback(
    (item: SlashMenuItem) => {
      const { from } = editor.state.selection;
      const currentFilter = filterRef.current;
      // Delete "/" + filter text
      const deleteFrom = from - currentFilter.length - 1;
      editor.chain().focus().deleteRange({ from: Math.max(0, deleteFrom), to: from }).run();
      item.action(editor);
      close();
    },
    [editor, close]
  );

  // Single persistent keydown handler — uses refs to avoid stale closures
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!openRef.current || filteredRef.current.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredRef.current.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredRef.current.length) % filteredRef.current.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = filteredRef.current[selectedIndexRef.current];
        if (item) executeItem(item);
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    const editorEl = editor.view.dom;
    editorEl.addEventListener("keydown", handleKeyDown, true);
    return () => editorEl.removeEventListener("keydown", handleKeyDown, true);
  }, [editor, executeItem, close]);

  // Detect "/" typed to open menu
  useEffect(() => {
    function onUpdate() {
      const { from } = editor.state.selection;
      const start = Math.max(0, from - 20);
      const textBefore = editor.state.doc.textBetween(start, from, "\n");
      const match = textBefore.match(/(?:^|\s)\/(\w*)$/);

      if (match) {
        setFilter(match[1]);
        setSelectedIndex(0);

        // Position the menu below cursor — fixed positioning avoids overflow clipping
        const domPos = editor.view.domAtPos(from);
        if (domPos.node) {
          const range = document.createRange();
          range.setStart(domPos.node, domPos.offset);
          range.collapse(true);
          const rect = range.getBoundingClientRect();
          setCoords({
            top: rect.bottom + 4,
            left: rect.left,
          });
        }
        openRef.current = true; // sync ref immediately
        setOpen(true);
      } else if (openRef.current) {
        close();
      }
    }

    editor.on("update", onUpdate);

    // Close slash menu on scroll — fixed positioning won't track content
    const handleScroll = () => { if (openRef.current) close(); };
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      editor.off("update", onUpdate);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [editor, close]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
      {open && filtered.length > 0 && (
        <div
          className="fixed z-50 w-56 rounded-lg border border-border bg-white py-1 shadow-lg"
          style={{ top: coords.top, left: coords.left }}
        >
          {filtered.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); executeItem(item); }}
              className={`flex w-full items-center gap-3 px-3 py-2 text-sm ${
                i === selectedIndex ? "bg-surface text-primary" : "text-foreground hover:bg-surface"
              }`}
            >
              <span className="text-muted-foreground">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
