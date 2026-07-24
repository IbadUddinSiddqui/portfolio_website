import type { Metadata } from "next";
import { getPublishedProjects, getCategories } from "@/data/projects";
import { ProjectGrid } from "@/components/sections/projects/project-grid";
import { FadeIn } from "@/components/animations/fade-in";

// Force dynamic — build cannot reach Neon DB for static generation.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio — full-stack applications, design systems, and open-source work.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getPublishedProjects(),
    getCategories(),
  ]);

  return (
    <div className="container pt-28 pb-section">
      {/* Page header */}
      <FadeIn>
        <div className="mb-14 max-w-2xl">
          <div className="section-label mb-5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Portfolio
          </div>
          <h1 className="text-h1 font-heading font-bold tracking-tight mb-4">
            Projects
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A curated collection of things I&apos;ve built — from full-stack
            applications and design systems to open-source libraries and
            experiments.
          </p>
        </div>
      </FadeIn>

      {/* Filterable grid */}
      <ProjectGrid projects={projects} categories={categories} />
    </div>
  );
}
