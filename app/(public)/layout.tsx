/**
 * Public layout — wraps all public-facing pages with header/footer placeholders.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header placeholder — will be implemented in Phase 4 */}
      <header className="border-b border-bg-alt bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <span className="text-lg font-bold text-primary">HIEA</span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer placeholder — will be implemented in Phase 4 */}
      <footer className="border-t border-bg-alt bg-bg-alt px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-text/60">
          &copy; {new Date().getFullYear()} HIEA - Hiệp hội Doanh nghiệp TP.HCM
        </div>
      </footer>
    </div>
  );
}
