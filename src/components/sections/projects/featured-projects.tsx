import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { ProjectCard } from "./project-card";
import type { ProjectListItem } from "@/data/projects";
import { ArrowRight } from "lucide-react";

interface FeaturedProjectsProps {
  projects: ProjectListItem[];
}

/**
 * FeaturedProjects
 *
 * Server component — renders up to 3 featured projects from the DB.
 * Staggered entrance animation via Stagger/StaggerItem wrappers.
 */
export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="container py-section" aria-labelledby="featured-projects-heading">
      {/* Section header */}
      <FadeIn>
        <div className="flex items-end justify-between mb-14 gap-4 flex-wrap">
          <div>
            <div className="section-label mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Selected Work
            </div>
            <h2
              id="featured-projects-heading"
              className="text-h2 font-heading font-bold tracking-tight"
            >
              Featured Projects
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
              A curated selection of work that demonstrates engineering depth,
              design sensibility, and real-world impact.
            </p>
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 shrink-0"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeIn>

      {/* Project grid */}
      <Stagger staggerDelay={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project, i) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} index={i} />
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
