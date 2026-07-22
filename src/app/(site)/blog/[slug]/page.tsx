import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getLatestPosts, getPublishedPosts, getAllPostSlugs } from "@/data/blog";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import "highlight.js/styles/github-dark.css";

// ─── Generate Static Params ──────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

// ─── Page ────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Get reading time estimate
  const wordsPerMinute = 200;
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Get latest posts for sidebar
  const latestPosts = await getLatestPosts(5);

  return (
    <article className="container py-section">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        {/* Main Content */}
        <div>
          {/* Back Link */}
          <FadeIn>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>
          </FadeIn>

          {/* Post Header */}
          <FadeIn delay={0.1}>
            <header className="mb-10">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((t) => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t.toLowerCase())}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-surface-secondary transition-colors"
                      >
                        {t}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-h2 md:text-h1 font-heading font-bold tracking-tight leading-[1.05] mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {post.publishedAt
                    ? formatDate(post.publishedAt)
                    : formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-10 rounded-xl overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-[2/1] object-cover"
                />
              </div>
            )}
          </FadeIn>

          {/* Post Content */}
          <FadeIn delay={0.2}>
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </FadeIn>

          {/* Post Footer */}
          <FadeIn delay={0.3}>
            <Separator className="my-12" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>

              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(
                    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Twitter
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* Latest Posts */}
            <FadeIn delay={0.15}>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Latest Posts
                </h3>
                <div className="space-y-3">
                  {latestPosts
                    .filter((p) => p.slug !== slug)
                    .slice(0, 5)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="block group"
                      >
                        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.publishedAt
                            ? formatDate(p.publishedAt)
                            : formatDate(p.createdAt)}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </FadeIn>

            {/* Tags Cloud */}
            {post.tags.length > 0 && (
              <FadeIn delay={0.2}>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Link key={t} href={`/blog?tag=${encodeURIComponent(t.toLowerCase())}`}>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted transition-colors text-xs"
                        >
                          {t}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* RSS Link */}
            <FadeIn delay={0.25}>
              <Link
                href="/blog/feed.xml"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12C4 13.1046 3.10457 14 2 14C0.89543 14 0 13.1046 0 12C0 10.8954 0.89543 10 2 10C3.10457 10 4 10.8954 4 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14 14H10C10 7.37258 5.62742 3 0 3V0C8.83656 0 16 7.16344 16 16H14Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8 14H6C6 9.58172 3.41828 7 0 6V4C5.52285 4 10 8.47715 10 14H8Z"
                    fill="currentColor"
                  />
                </svg>
                RSS Feed
              </Link>
            </FadeIn>
          </div>
        </aside>
      </div>
    </article>
  );
}
