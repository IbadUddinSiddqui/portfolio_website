import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { cache } from "react";

const getStats = cache(async () => {
  const [projects, labs, workflows, certifications] = await Promise.all([
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.lab.count({ where: { status: "PUBLISHED" } }),
    db.workflow.count({ where: { status: "PUBLISHED" } }),
    db.certification.count(),
  ]);
  return { projects, labs, workflows, certifications };
});

export async function DynamicStatsBar() {
  const stats = await getStats();
  const items = [
    { value: `${stats.projects}+`, label: "Projects built" },
    { value: `${stats.labs}+`, label: "Lab experiments" },
    { value: `${stats.workflows}+`, label: "Automation workflows" },
    { value: `${stats.certifications}+`, label: "Certifications" },
  ];

  if (stats.projects === 0 && stats.labs === 0) return null;

  return (
    <FadeIn direction="up" delay={0.1}>
      <section className="border-y border-border/40 bg-muted/20 backdrop-blur-sm" aria-label="Statistics">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
            {items.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-6 px-4 gap-1 text-center">
                <span className="text-2xl font-bold font-heading tracking-tight text-gradient">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
