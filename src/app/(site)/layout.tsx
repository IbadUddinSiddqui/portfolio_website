import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { PageTransition } from "@/components/layout/page-transition";
import { Toaster } from "sonner";

/**
 * Site Layout
 *
 * Wraps all public-facing pages with the site chrome:
 * - Header with navigation and theme switcher
 * - Custom cursor
 * - Page transitions
 * - Main content area
 * - Footer with social links
 * - Toast notifications
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <CustomCursor />

      {/* Main Content with page transitions */}
      <main className="min-h-screen pt-16">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
      />
    </>
  );
}
