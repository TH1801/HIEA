import Link from "next/link";

type FilterTab = {
  label: string;
  value: string | undefined;
};

const TABS: FilterTab[] = [
  { label: "Tất cả", value: undefined },
  { label: "Bản nháp", value: "draft" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã xuất bản", value: "published" },
];

/**
 * Filter tabs for article status — underline style per .pen design.
 * Active tab: primary blue text + 2px bottom border.
 * Inactive: muted text.
 */
export function ArticleFilterTabs({
  currentStatus,
  basePath = "/admin/dashboard",
}: {
  currentStatus?: string;
  basePath?: string;
}) {
  return (
    <div className="flex border-b border-border">
      {TABS.map((tab) => {
        const isActive =
          tab.value === currentStatus ||
          (!tab.value && !currentStatus);
        const href = tab.value
          ? `${basePath}?status=${tab.value}`
          : basePath;

        return (
          <Link
            key={tab.label}
            href={href}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
