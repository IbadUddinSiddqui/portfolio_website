import { getDashboardStats } from "prisma/data-actions";
import { FadeIn } from "@/components/animations/fade-in";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <FadeIn>
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Overview of your portfolio.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Projects"
            value={stats.projects.total}
            sub={`${stats.projects.published} published, ${stats.projects.drafts} drafts`}
          />
          <StatCard
            label="Published Projects"
            value={stats.projects.published}
            sub="Live on site"
          />
          <StatCard
            label="Blog Posts"
            value={stats.blogPosts}
            sub="Published articles"
          />
          <StatCard
            label="Messages"
            value={stats.messages.total}
            sub={`${stats.messages.unread} unread`}
            highlight={stats.messages.unread > 0}
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/projects"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              New Project
            </a>
            <a
              href="/admin/messages"
              className="px-4 py-2 rounded-lg bg-surface-secondary text-foreground text-sm font-medium hover:bg-surface-secondary/80 transition-colors"
            >
              {stats.messages.unread > 0
                ? `View Messages (${stats.messages.unread} new)`
                : "View Messages"}
            </a>
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-surface-secondary text-foreground text-sm font-medium hover:bg-surface-secondary/80 transition-colors"
            >
              View Site
            </a>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "border-accent-engineering/30 bg-accent-engineering/5" : "border-card-border bg-card-background"}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? "text-accent-engineering" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
