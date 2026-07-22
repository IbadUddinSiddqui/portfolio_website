import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getEntry, listEntries, ALL_CONTENT_TYPES, findRelatedEntries, type ContentType } from "@/lib/mdx";
import { MdxRenderer } from "@/components/mdx/mdx-renderer";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, BookOpen, Layers, Wrench } from "lucide-react";
import "highlight.js/styles/github-dark.css";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  labs: "Lab Manuals",
  projects: "Projects",
  "client-work": "Client Work",
  automation: "Automation",
  courses: "Courses",
  research: "Research",
  certifications: "Certifications",
  learning: "Learning",
  blog: "Blog",
};

// ─── Generate Static Params ──────────────────────────

export async function generateStaticParams() {
  const entries = listEntries(undefined, "published");
  return entries.map((e) => ({
    type: e.type,
    slug: e.slug,
  }));
}

// ─── Metadata ────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const entry = getEntry(type as ContentType, slug);

  if (!entry) return { title: "Not Found" };

  const fm = entry.frontmatter;
  return {
    title: fm.seoTitle || fm.title,
    description: fm.seoDescription || `${fm.title} — Engineering content from ${fm.department || fm.category || "my portfolio"}.`,
    keywords: fm.keywords?.join(", ") || fm.tags?.join(", "),
    openGraph: {
      title: fm.seoTitle || fm.title,
      description: fm.seoDescription || undefined,
      type: "article",
      publishedTime: fm.publishedAt || fm.createdAt,
      tags: fm.tags,
      ...(fm.ogImage ? { images: [{ url: fm.ogImage }] } : {}),
    },
  };
}

// ─── Page ────────────────────────────────────────────

export default async function MdxContentPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;

  if (!ALL_CONTENT_TYPES.includes(type as ContentType)) {
    notFound();
  }

  const entry = getEntry(type as ContentType, slug);
  if (!entry || entry.frontmatter.status !== "published") {
    notFound();
  }

  const fm = entry.frontmatter;
  const related = findRelatedEntries(entry, 4);

  return (
    <div className="container py-section">
      {/* Back Link */}
      <FadeIn direction="left">
        <Link
          href={`/${type}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {CONTENT_TYPE_LABELS[type] || type}
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        {/* Main Content */}
        <div>
          {/* Header */}
          <FadeIn>
            <header className="mb-10">
              {/* Type & Category badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs font-medium">
                  {CONTENT_TYPE_LABELS[type] || type}
                </Badge>
                {fm.category && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {fm.category}
                  </Badge>
                )}
              </div>

              <h1 className="text-h2 md:text-h1 font-heading font-bold tracking-tight leading-[1.05] mb-4">
                {fm.title}
              </h1>

              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {fm.course && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {fm.course}
                  </span>
                )}
                {fm.department && (
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4" />
                    {fm.department}
                  </span>
                )}
                {fm.semester && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {fm.semester} Semester
                  </span>
                )}
                {fm.difficulty && (
                  <span className="flex items-center gap-1.5 capitalize">
                    <Wrench className="h-4 w-4" />
                    {fm.difficulty}
                  </span>
                )}
                {fm.year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {fm.year}
                  </span>
                )}
              </div>

              {/* Tags */}
              {fm.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {fm.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-default"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>
          </FadeIn>

          {/* Content */}
          <FadeIn delay={0.1}>
            <MdxRenderer
              content={entry.content}
              frontmatter={fm}
              showMetadata={false}
            />
          </FadeIn>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* Technologies */}
            {fm.technologies?.length > 0 && (
              <FadeIn delay={0.15}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {fm.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-surface-secondary text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Software */}
            {fm.software?.length > 0 && (
              <FadeIn delay={0.2}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Software
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {fm.software.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-surface-secondary text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Hardware */}
            {fm.hardware?.length > 0 && (
              <FadeIn delay={0.25}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Hardware
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {fm.hardware.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 rounded-lg bg-surface-secondary text-xs font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Skills */}
            {fm.skills?.length > 0 && (
              <FadeIn delay={0.3}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {fm.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Related Content */}
            {related.length > 0 && (
              <FadeIn delay={0.35}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Related Content
                  </h3>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <Link
                        key={`${r.type}-${r.slug}`}
                        href={`/content/${r.type}/${r.slug}`}
                        className="block group"
                      >
                        <div className="p-3 rounded-lg bg-surface-secondary/30 border border-border/50 hover:bg-surface-secondary/50 transition-colors">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {r.frontmatter.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {CONTENT_TYPE_LABELS[r.type] || r.type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
