import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "◉" },
  { href: "/admin/projects", label: "Projects", icon: "◆" },
  { href: "/admin/labs", label: "Labs", icon: "⊞" },
  { href: "/admin/workflows", label: "Workflows", icon: "⚡" },
  { href: "/admin/certifications", label: "Certifications", icon: "★" },
  { href: "/admin/categories", label: "Categories", icon: "⊡" },
  { href: "/admin/skills", label: "Skills", icon: "⬡" },
  { href: "/admin/learning", label: "Learning", icon: "⊗" },
  { href: "/admin/media", label: "Media", icon: "⊟" },
  { href: "/admin/blog", label: "Blog", icon: "◇" },
  { href: "/admin/messages", label: "Messages", icon: "◎" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

/**
 * Admin Layout
 *
 * Protected admin dashboard with sidebar navigation.
 * All pages under /admin are noindex for SEO.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              P
            </div>
            <span className="text-sm font-semibold">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span className="w-5 text-center text-xs">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← View site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-6 bg-background">
          <span className="text-sm font-medium">Dashboard</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" richColors closeButton />
    </div>
  );
}
