import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { GlassCard } from "@/components/animations/glass-card";
import { ArrowRight, Briefcase, ExternalLink } from "lucide-react";
import { cache } from "react";

const getClientProjects = cache(async () => {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", visibility: "PUBLIC", clientId: { not: null } },
    include: { client: { select: { name: true, logo: true, website: true, color: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return projects;
});

export async function ClientWork() {
  const projects = await getClientProjects();
  if (projects.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="clients-heading">
      <FadeIn>
        <div className="flex items-end justify-between mb-14 gap-4 flex-wrap">
          <div className="max-w-2xl">
            <div className="section-label mb-4">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Client Work
            </div>
            <h2 id="clients-heading" className="text-h2 font-heading font-bold tracking-tight mb-3">
              Projects for clients
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional work delivered for businesses and organizations.
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

      <Stagger staggerDelay={0.07}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <GlassCard className="p-6 group relative overflow-hidden" glow>
                <div className="flex items-start gap-4">
                  {/* Client logo/avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold text-white"
                    style={{ background: project.client?.color || "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {project.client?.name?.charAt(0) || "C"}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Client name */}
                    <p className="text-xs text-muted-foreground mb-1">
                      {project.client?.name || "Client"}
                    </p>

                    {/* Project title */}
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors mb-2">
                      <Link href={`/projects/${project.slug}`} className="hover:underline">
                        {project.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    {project.shortDescription && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {project.shortDescription}
                      </p>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Case Study <ArrowRight className="h-3 w-3" />
                      </Link>
                      {project.client?.website && (
                        <a
                          href={project.client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
