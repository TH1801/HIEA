import HeaderNavigation from "@/components/public/header-navigation";
import FooterSection from "@/components/public/footer-section";

/**
 * Public layout — wraps all public-facing pages with header and footer.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNavigation />
      <main className="flex-1">{children}</main>
      <FooterSection />
    </div>
  );
}
