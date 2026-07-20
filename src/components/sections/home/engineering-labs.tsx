import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { GlassCard } from "@/components/animations/glass-card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Beaker, FlaskConical, Cpu, Microscope, TestTube, CircuitBoard } from "lucide-react";
import { cache } from "react";
import { cn } from "@/lib/utils";

const getLabs = cache(async () => {
  return db.lab.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
});

const categoryIcons: Record<string, typeof Beaker> = {
  electronics: CircuitBoard,
  programming: Cpu,
  matlab: Microscope,
  labview: TestTube,
  multisim: FlaskConical,
  orcad: CircuitBoard,
  drawing: Beaker,
};

const categoryColors: Record<string, string> = {
  electronics: "from-red-500/10 to-orange-500/10 border-red-500/20 text-red-400",
  programming: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400",
  matlab: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-400",
  labview: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400",
  multisim: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400",
  orcad: "from-teal-500/10 to-cyan-500/10 border-teal-500/20 text-teal-400",
};

export async function EngineeringLabs() {
  const labs = await getLabs();
  if (labs.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="labs-heading">
      <FadeIn>
        <div className="flex items-end justify-between mb-14 gap-4 flex-wrap">
          <div className="max-w-2xl">
            <div className="section-label mb-4">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              University Labs
            </div>
            <h2 id="labs-heading" className="text-h2 font-heading font-bold tracking-tight mb-3">
              Engineering lab work
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hands-on experiments from university — electronics, embedded systems, simulations, and more.
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
          {labs.map((lab) => {
            const Icon = categoryIcons[lab.category || ""] || Beaker;
            const colorClass = categoryColors[lab.category || ""] || categoryColors.electronics;

            return (
              <StaggerItem key={lab.id}>
                <GlassCard className="p-5 group relative overflow-hidden h-full flex flex-col" glow>
                  {/* Icon + Category */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br border", colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {lab.category && (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {lab.category}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors mb-2">
                    {lab.title}
                  </h3>

                  {/* Summary */}
                  {lab.summary && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
                      {lab.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
                    {lab.difficulty && (
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {lab.difficulty}
                      </span>
                    )}
                    {lab.year && (
                      <span className="text-[10px] text-muted-foreground">{lab.year}</span>
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
