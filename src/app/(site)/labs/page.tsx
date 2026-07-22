import type { Metadata } from "next";
import Link from "next/link";
import { listEntries, type MdxEntry } from "@/lib/mdx";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Laboratory Manuals",
  description: "Engineering laboratory manuals and experiments — from basic electronics and computer programming to PCB design and virtual instrumentation.",
};

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  advanced: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  expert: "text-violet-400 bg-violet-400/10 border-violet-400/20",
};

const COURSE_COLORS: Record<string, string> = {
  "Basic Electronics Laboratory": "border-blue-500/30 bg-blue-500/5",
  "TC-106 Computer Programming Lab": "border-emerald-500/30 bg-emerald-500/5",
  "Electronic Engineering Drawing & Engineering Software (EEDW)": "border-amber-500/30 bg-amber-500/5",
};

interface CourseGroup {
  course: string;
  entries: MdxEntry[];
}

function groupByCourse(entries: MdxEntry[]): CourseGroup[] {
  const groups: Record<string, MdxEntry[]> = {};
  for (const entry of entries) {
    const course = entry.frontmatter.course || "Other";
    if (!groups[course]) groups[course] = [];
    groups[course].push(entry);
  }
  return Object.entries(groups)
    .map(([course, entries]) => ({ course, entries }))
    .sort((a, b) => a.course.localeCompare(b.course));
}

export default async function LabsPage() {
  const entries = listEntries("labs", "published");
  const courseGroups = groupByCourse(entries);
  const totalLabs = entries.length;

  return (
    <div className="container pt-28 pb-section">
      {/* Page Header */}
      <FadeIn>
        <div className="mb-14 max-w-2xl">
          <div className="section-label mb-5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Laboratory
          </div>
          <h1 className="text-h1 font-heading font-bold tracking-tight mb-4">
            Lab Manuals
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Engineering laboratory experiments across electronics, computer programming, PCB design, and virtual instrumentation.
            {totalLabs > 0 && (
              <span className="block mt-2 text-sm">
                <span className="font-semibold text-foreground">{totalLabs}</span> experiments across{" "}
                <span className="font-semibold text-foreground">{courseGroups.length}</span> courses.
              </span>
            )}
          </p>
        </div>
      </FadeIn>

      {/* No labs state */}
      {entries.length === 0 ? (
        <FadeIn>
          <div className="rounded-xl border border-dashed border-border p-16 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No lab manuals published yet.</p>
          </div>
        </FadeIn>
      ) : (
        /* Course Groups */
        <div className="space-y-16">
          {courseGroups.map((group, gi) => (
            <FadeIn key={group.course} delay={gi * 0.1}>
              <div>
                {/* Course Header */}
                <div className="mb-6">
                  <h2 className="text-h3 font-heading font-bold tracking-tight mb-2">
                    {group.course}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {group.entries.length} laboratory session{group.entries.length > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Lab Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.entries.map((entry, i) => {
                    const fm = entry.frontmatter;
                    const isEEDW = group.course.includes("EEDW");
                    const subdir = isEEDW
                      ? entry.filePath.split(/[/\\]/).slice(-2, -1)[0]
                      : null;

                    return (
                      <Link
                        key={`${entry.type}-${entry.slug}`}
                        href={`/content/labs/${entry.slug}`}
                        className="group block"
                      >
                        <div
                          className={`relative h-full rounded-2xl border border-card-border/50 bg-card-background p-5 overflow-hidden
                            transition-all duration-300
                            hover:border-primary/30 hover:shadow-card-primary
                            ${COURSE_COLORS[group.course] || "bg-card-background"}`}
                        >
                          {/* Shimmer */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                          {/* Subcategory badge */}
                          {fm.subcategory && (
                            <Badge
                              variant="outline"
                              className="mb-3 text-xs font-medium"
                            >
                              {fm.subcategory}
                            </Badge>
                          )}
                          {subdir && (
                            <Badge
                              variant="outline"
                              className="mb-3 text-xs font-medium capitalize"
                            >
                              {subdir}
                            </Badge>
                          )}

                          {/* Title */}
                          <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200 mb-2 line-clamp-2">
                            {fm.title}
                          </h3>

                          {/* Domain & Difficulty */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {fm.domain && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Layers className="h-3 w-3" />
                                {fm.domain}
                              </span>
                            )}
                            {fm.difficulty && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium border capitalize ${
                                  difficultyColors[fm.difficulty] || "text-muted-foreground bg-surface-secondary border-border"
                                }`}
                              >
                                {fm.difficulty}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {fm.tags && fm.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {fm.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded text-[10px] bg-surface-secondary/80 text-muted-foreground font-mono border border-border/50"
                                >
                                  {tag}
                                </span>
                              ))}
                              {fm.tags.length > 3 && (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-muted/80 text-muted-foreground border border-border/50">
                                  +{fm.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Bottom row */}
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                              Session {fm.laboratorySession || fm.session}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Open <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
