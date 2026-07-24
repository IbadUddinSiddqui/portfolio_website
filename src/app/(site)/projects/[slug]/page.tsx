import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProjects, getProjectBySlug, getRelatedProjects } from "@/data/projects";
import { FadeIn } from "@/components/animations/fade-in";
import { GlassCard } from "@/components/animations/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for the project detail page.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.shortDescription || project.description,
  };
}

/**
 * Project Detail Page
 *
 * Full project case study with:
 * - Gallery of images
 * - Problem / Solution / Architecture sections
 * - Timeline of development
 * - Technology tags
 * - Links (GitHub, live demo)
 * - Related projects
 */

// Force dynamic — build cannot reach Neon DB for static generation.
export const dynamic = "force-dynamic";

/**
 * Generate static params for all published projects (SSG).
 *
 * Wrapped in try-catch so the build doesn't fail if the database
 * is unreachable (e.g., during Vercel builds connecting to Neon).
 * Falls back to dynamic rendering on first request.
 */
export async function generateStaticParams() {
  try {
    const projects = await getPublishedProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.warn(
      "⚠️ [projects] DB unreachable during build — skipping static generation:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = await getRelatedProjects(slug, project.category?.slug || null);

  return (
    <div className="container pt-24 pb-section">
      {/* Back button */}
      <FadeIn direction="left">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </FadeIn>

      {/* Hero */}
      <FadeIn>
        <div className="max-w-4xl">
          {/* Category Badge */}
          {project.category && (
            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              {project.category.name}
            </span>
          )}

          <h1 className="text-h1 font-heading font-bold tracking-tight mb-6">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                <Button className="group">
                  Live Demo
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="group">
                  <GitHubLogoIcon className="mr-2 h-4 w-4" />
                  Source Code
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
            {project.difficulty && (
              <span className="px-2 py-0.5 rounded bg-surface-secondary text-xs capitalize">
                {project.difficulty}
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <FadeIn delay={0.1}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((img, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-surface-secondary aspect-video"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${project.title} screenshot ${i + 1}`}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Content Sections */}
      <div className="mt-16 max-w-3xl space-y-12">
        {/* Problem & Solution */}
        {project.problemStatement && (
          <FadeIn delay={0.2}>
            <section>
              <h2 className="text-h3 font-heading font-bold mb-4">The Problem</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.problemStatement}
              </p>
            </section>
          </FadeIn>
        )}

        {project.solution && (
          <FadeIn delay={0.3}>
            <section>
              <h2 className="text-h3 font-heading font-bold mb-4">The Solution</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.solution}
              </p>
            </section>
          </FadeIn>
        )}

        {project.architecture && (
          <FadeIn delay={0.4}>
            <section>
              <h2 className="text-h3 font-heading font-bold mb-4">Architecture</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.architecture}
              </p>
            </section>
          </FadeIn>
        )}

        {/* Timeline */}
        {project.timeline.length > 0 && (
          <FadeIn delay={0.5}>
            <section>
              <h2 className="text-h3 font-heading font-bold mb-6">Timeline</h2>
              <div className="space-y-6">
                {project.timeline.map((entry, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                      {i < project.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="font-medium mt-1">{entry.title}</p>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Technologies */}
        <FadeIn delay={0.6}>
          <section>
            <h2 className="text-h3 font-heading font-bold mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Lessons Learned */}
        {project.lessonsLearned && (
          <FadeIn delay={0.7}>
            <section>
              <h2 className="text-h3 font-heading font-bold mb-4">Lessons Learned</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.lessonsLearned}
              </p>
            </section>
          </FadeIn>
        )}
      </div>

      {/* Related Projects */}
      {related.length > 0 && (
        <FadeIn delay={0.8}>
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="text-h3 font-heading font-bold mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/projects/${item.slug}`} className="group">
                  <GlassCard hover>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-xs bg-surface-secondary">
                          {t}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}
    </div>
  );
}
