import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { GlassCard } from "@/components/animations/glass-card";
import { Code2, Server, Terminal, Container, Cpu, Palette, type LucideIcon } from "lucide-react";
import { cache } from "react";

const getSkills = cache(async () => {
  return db.skillCategory.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
});

const iconMap: Record<string, LucideIcon> = {
  Code2, Server, Terminal, Container, Cpu, Palette,
};

const gradientMap: Record<string, string> = {
  Frontend: "from-blue-500/20 to-cyan-500/20",
  Backend: "from-emerald-500/20 to-teal-500/20",
  Languages: "from-amber-500/20 to-yellow-500/20",
  "DevOps & Tools": "from-violet-500/20 to-purple-500/20",
  "Hardware & Electronics": "from-red-500/20 to-rose-500/20",
  Design: "from-pink-500/20 to-fuchsia-500/20",
};

export async function SkillsShowcase() {
  const categories = await getSkills();
  if (categories.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="skills-heading">
      <FadeIn>
        <div className="mb-14 max-w-2xl">
          <div className="section-label mb-4">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Skills
          </div>
          <h2 id="skills-heading" className="text-h2 font-heading font-bold tracking-tight mb-3">
            Technology Stack
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Technologies I work with regularly, organized by category.
          </p>
        </div>
      </FadeIn>

      <Stagger staggerDelay={0.05}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon || ""] || Code2;
            const gradient = gradientMap[cat.name] || "from-primary/10 to-secondary/10";

            return (
              <StaggerItem key={cat.id}>
                <GlassCard className="p-6 group relative overflow-hidden" glow>
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{cat.name}</h3>
                        <span className="text-xs text-muted-foreground">{cat.skills.length} technologies</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/5 text-foreground/80 border border-border/30 hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
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
