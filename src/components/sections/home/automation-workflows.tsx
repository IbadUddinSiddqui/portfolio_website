import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { GlassCard } from "@/components/animations/glass-card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, GitBranch, FileText, Mail, UserPlus, Globe, Activity } from "lucide-react";
import { cache } from "react";
import { cn, parseJsonArray } from "@/lib/utils";

const getWorkflows = cache(async () => {
  return db.workflow.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
});

const categoryConfig: Record<string, { icon: typeof Zap; label: string; color: string }> = {
  github: { icon: GitBranch, label: "GitHub", color: "from-gray-500/10 to-gray-600/10 border-gray-500/20 text-gray-400" },
  linkedin: { icon: Globe, label: "LinkedIn", color: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400" },
  portfolio: { icon: Activity, label: "Portfolio", color: "from-violet-500/10 to-violet-600/10 border-violet-500/20 text-violet-400" },
  leads: { icon: UserPlus, label: "Leads", color: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400" },
  pdf: { icon: FileText, label: "PDF", color: "from-red-500/10 to-red-600/10 border-red-500/20 text-red-400" },
  crm: { icon: UserPlus, label: "CRM", color: "from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-400" },
  email: { icon: Mail, label: "Email", color: "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 text-yellow-400" },
  resume: { icon: FileText, label: "Resume", color: "from-pink-500/10 to-pink-600/10 border-pink-500/20 text-pink-400" },
};

export async function AutomationWorkflows() {
  const workflows = await getWorkflows();
  if (workflows.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="workflows-heading">
      <FadeIn>
        <div className="flex items-end justify-between mb-14 gap-4 flex-wrap">
          <div className="max-w-2xl">
            <div className="section-label mb-4">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Automation
            </div>
            <h2 id="workflows-heading" className="text-h2 font-heading font-bold tracking-tight mb-3">
              n8n Workflows
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automated workflows that connect services, process data, and eliminate repetitive tasks.
            </p>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeIn>

      <Stagger staggerDelay={0.06}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflows.map((wf) => {
            const config = categoryConfig[wf.category || ""] || { icon: Zap, label: wf.category || "Workflow", color: "from-primary/10 to-secondary/10 border-primary/20 text-primary" };
            const Icon = config.icon;

            return (
              <StaggerItem key={wf.id}>
                <GlassCard className="p-5 group relative overflow-hidden h-full flex flex-col" glow>
                  {/* Icon + Category */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br border", config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="text-xxs uppercase tracking-wider">
                      {config.label}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors mb-2">
                    {wf.title}
                  </h3>

                  {/* Summary */}
                  {wf.summary && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                      {wf.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
                    {wf.difficulty && (
                      <span className="text-xxs text-muted-foreground capitalize">{wf.difficulty}</span>
                    )}
                    {wf.services && (
                      <span className="text-xxs text-muted-foreground truncate ml-2">
                        {parseJsonArray(wf.services).length} services
                      </span>
                    )}
                  </div>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </div>
      </Stagger>
    </section>
  );
}
