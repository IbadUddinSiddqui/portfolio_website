import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Components } from "react-markdown";
import type { MdxFrontmatter } from "@/lib/mdx-types";
import { CalendarDays, Clock, Tag, Layers, Wrench, Cpu, BookOpen } from "lucide-react";

// ─── Props ───────────────────────────────────────────

interface MdxRendererProps {
  content: string;
  frontmatter?: MdxFrontmatter;
  showMetadata?: boolean;
  className?: string;
}

// ─── Custom Components ───────────────────────────────

const components: Partial<Components> = {
  h1: ({ children, id, ...props }) => (
    <h1 id={id} className="text-h2 md:text-h1 font-heading font-bold tracking-tight leading-[1.1] mb-6 mt-0 scroll-mt-24" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="text-h3 md:text-h2 font-heading font-bold tracking-tight leading-[1.15] mb-4 mt-12 scroll-mt-24 border-b border-border pb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="text-h4 md:text-h3 font-heading font-semibold tracking-tight mb-3 mt-8 scroll-mt-24" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4 id={id} className="text-base md:text-lg font-semibold mb-2 mt-6 scroll-mt-24" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-muted-foreground leading-relaxed mb-4 last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1.5 mb-4 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-4 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 py-2 mb-4 italic text-muted-foreground bg-surface-secondary/30 rounded-r-lg" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-surface-secondary text-sm font-mono text-primary border border-border/50" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} block`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className="rounded-xl border border-border bg-surface-secondary/80 p-4 mb-6 overflow-x-auto text-sm font-mono [&>code]:bg-transparent [&>code]:p-0 [&>code]:border-0" {...props}>
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-surface-secondary/50 border-b border-border" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 border-t border-border text-muted-foreground" {...props}>
      {children}
    </td>
  ),
  hr: ({ ...props }) => (
    <hr className="my-12 border-border" {...props} />
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary hover:underline font-medium"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }) => (
    <div className="mb-6 rounded-xl overflow-hidden border border-border bg-surface-secondary">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-auto object-cover"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="px-4 py-2 text-xs text-center text-muted-foreground border-t border-border bg-surface-secondary/30">
          {alt}
        </p>
      )}
    </div>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>{children}</em>
  ),
};

// ─── Metadata Bar ────────────────────────────────────

function MetadataBar({ frontmatter }: { frontmatter: MdxFrontmatter }) {
  const items = [];

  if (frontmatter.course) {
    items.push({ icon: BookOpen, label: frontmatter.course });
  }
  if (frontmatter.department) {
    items.push({ icon: Layers, label: frontmatter.department });
  }
  if (frontmatter.semester) {
    items.push({ icon: CalendarDays, label: `${frontmatter.semester} Semester` });
  }
  if (frontmatter.difficulty) {
    items.push({ icon: Wrench, label: frontmatter.difficulty });
  }
  if (frontmatter.technologies?.length) {
    items.push({ icon: Cpu, label: frontmatter.technologies.slice(0, 3).join(", ") });
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary/50 border border-border/50 text-xs text-muted-foreground"
        >
          <item.icon className="h-3 w-3" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ─── Tags Row ────────────────────────────────────────

function TagsRow({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 rounded-md bg-primary/8 text-primary text-xs font-medium border border-primary/15"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ─── Renderer ────────────────────────────────────────

export function MdxRenderer({
  content,
  frontmatter,
  showMetadata = true,
  className = "",
}: MdxRendererProps) {
  return (
    <article className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      {frontmatter && showMetadata && (
        <>
          {frontmatter.tags?.length > 0 && <TagsRow tags={frontmatter.tags} />}
          {frontmatter.technologies?.length > 0 && <MetadataBar frontmatter={frontmatter} />}
        </>
      )}

      <div className="mdx-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeHighlight,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
