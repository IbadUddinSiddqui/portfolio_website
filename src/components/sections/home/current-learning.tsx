import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { GlassCard } from "@/components/animations/glass-card";
import { cache } from "react";

const getLearningData = cache(async () => {
  return db.currentLearning.findMany({ orderBy: { order: "asc" } });
});

const statusColors: Record<string, string> = {
  PLANNING: "from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400",
  LEARNING: "from-amber-500/10 to-amber-600/10 border-amber-500/30 text-amber-400",
  PRACTICING: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
  MASTERED: "from-violet-500/10 to-violet-600/10 border-violet-500/30 text-violet-400",
};

export async function CurrentLearning() {
  const learning = await getLearningData();
  if (learning.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="learning-heading">
      <FadeIn>
        <div className="mb-14 max-w-2xl">
          <div className="section-label mb-4">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Currently Exploring
          </div>
          <h2 id="learning-heading" className="text-h2 font-heading font-bold tracking-tight mb-3">
            Always learning
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Technologies and tools I&apos;m actively studying and experimenting with.
          </p>
        </div>
      </FadeIn>

      <Stagger staggerDelay={0.06}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {learning.map((item) => (
            <StaggerItem key={item.id}>
              <GlassCard className="p-5 group relative overflow-hidden" glow>
                {/* Progress bar at top */}
                <div className="h-1 w-full rounded-full bg-surface-secondary/60 mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000"
                    style={{ width: `${item.progress ?? 0}%` }}
                  />
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                    {item.technology}
                  </h3>
                  <span className={`shrink-0 text-xxs font-medium px-2 py-0.5 rounded-full border ${statusColors[item.status] || statusColors.LEARNING}`}>
                    {item.status}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-secondary/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all duration-1000"
                      style={{ width: `${item.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-micro text-muted-foreground font-mono">
                    {item.progress ?? 0}%
                  </span>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
