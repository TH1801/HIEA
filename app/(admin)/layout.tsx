/**
 * Admin layout — wraps all /admin pages with sidebar placeholder.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder — will be implemented in Phase 6 */}
      <aside className="w-64 border-r border-bg-alt bg-white p-4">
        <span className="text-lg font-bold text-primary">HIEA Admin</span>
      </aside>

      <main className="flex-1 bg-bg-alt p-6">{children}</main>
    </div>
  );
}
