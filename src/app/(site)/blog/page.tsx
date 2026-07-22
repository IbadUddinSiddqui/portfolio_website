import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { formatDate, cn } from "@/lib/utils";
import { getPublishedPosts, getBlogTags } from "@/data/blog";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, design, and building premium products.",
};

interface PageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageStr, tag } = await searchParams;
  const currentPage = Math.max(1, Number(pageStr) || 1);

  const [{ posts, total, totalPages }, allTags] = await Promise.all([
    getPublishedPosts(currentPage, tag),
    getBlogTags(),
  ]);

  return (
    <div className="container pt-28 pb-section">
      {/* Header */}
      <FadeIn>
        <div className="mb-14 max-w-2xl">
          <div className="section-label mb-5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Writing
          </div>
          <h1 className="text-h1 font-heading font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Thoughts on web development, design systems, performance engineering,
            and building products people love.
          </p>
        </div>
      </FadeIn>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <FadeIn delay={0.1}>
          <div
            className="flex flex-wrap gap-2 mb-12"
            role="group"
            aria-label="Filter by tag"
          >
            <Link
              href="/blog"
              className={cn(
                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                !tag
                  ? "bg-primary text-primary-foreground shadow-primary-glow"
                  : "bg-surface-secondary/60 text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
              )}
            >
              All
            </Link>
            {allTags.map((t) => {
              const isActive = tag === t.toLowerCase();
              return (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t.toLowerCase())}`}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary-glow"
                      : "bg-surface-secondary/60 text-muted-foreground hover:text-foreground hover:bg-surface-secondary"
                  )}
                >
                  {t}
                </Link>
              );
            })}
          </div>
        </FadeIn>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <FadeIn delay={0.2}>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary/60 flex items-center justify-center mb-4 text-xl">
              ✦
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              {tag ? `No posts tagged "${tag}"` : "No posts published yet."}
            </p>
            {tag && (
              <Link
                href="/blog"
                className="text-xs text-primary hover:text-primary/80 transition-colors mt-3"
              >
                View all posts
              </Link>
            )}
          </div>
        </FadeIn>
      ) : (
        <Stagger staggerDelay={0.06}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full rounded-2xl border border-card-border/50 bg-card-background overflow-hidden hover:border-primary/30 hover:shadow-card-primary-soft transition-all duration-300"
                >
                  {/* Cover */}
                  <div className="aspect-[16/9] overflow-hidden bg-surface-secondary/40">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                        <span
                          className="text-5xl font-black text-muted-foreground/8 font-heading select-none"
                          aria-hidden="true"
                        >
                          ✦
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xxs px-2 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/15 font-medium uppercase tracking-wider"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title + arrow */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5" />
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/60 mt-auto pt-3 border-t border-border/30">
                      <span>
                        {post.publishedAt
                          ? formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" })
                          : formatDate(post.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {post.readingTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.readingTime} min read
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <FadeIn delay={0.3}>
          <nav
            className="flex items-center justify-center gap-2 mt-16"
            aria-label="Blog pagination"
          >
            <PaginationButton
              href={getPageUrl(currentPage - 1, tag)}
              disabled={currentPage <= 1}
            >
              ← Previous
            </PaginationButton>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={getPageUrl(page, tag)}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
                    page === currentPage
                      ? "bg-primary text-primary-foreground shadow-primary-glow-strong"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary/60"
                  )}
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </Link>
              ))}
            </div>

            <PaginationButton
              href={getPageUrl(currentPage + 1, tag)}
              disabled={currentPage >= totalPages}
            >
              Next →
            </PaginationButton>
          </nav>
        </FadeIn>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────

function getPageUrl(page: number, tag?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

function PaginationButton({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="px-4 py-2 rounded-xl text-sm text-muted-foreground/30 cursor-not-allowed select-none">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-surface-secondary/60 transition-colors duration-150"
    >
      {children}
    </Link>
  );
}
