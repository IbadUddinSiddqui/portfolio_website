import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  type ContentType,
  type MdxFrontmatter,
  type MdxEntry,
  type MdxImportResult,
  type SearchResult,
  type ValidationResult,
  ALL_CONTENT_TYPES,
  createDefaultFrontmatter,
  generateSlug,
} from "./mdx-types";

export type { ContentType, MdxFrontmatter, MdxEntry, MdxImportResult, SearchResult, ValidationResult };
export { ALL_CONTENT_TYPES, generateSlug };

// ─── Paths ───────────────────────────────────────────

const CONTENT_ROOT = path.join(process.cwd(), "content");

export function getContentDir(type: ContentType): string {
  const dir = path.join(CONTENT_ROOT, type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getFilePath(type: ContentType, slug: string): string {
  return path.join(getContentDir(type), `${slug}.mdx`);
}

// ─── Recursive File Walk ────────────────────────────

function walkMdxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── CRUD Operations ─────────────────────────────────

export function listEntries(
  type?: ContentType,
  status?: "draft" | "published" | "archived"
): MdxEntry[] {
  const types = type ? [type] : ALL_CONTENT_TYPES;
  const entries: MdxEntry[] = [];

  for (const t of types) {
    const dir = getContentDir(t);
    if (!fs.existsSync(dir)) continue;

    const files = walkMdxFiles(dir);

    for (const filePath of files) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        const fileName = path.basename(filePath).replace(/\.mdx$/, "");

        const frontmatter = data as MdxFrontmatter;
        frontmatter.slug = frontmatter.slug || fileName;
        frontmatter.type = frontmatter.type || t;

        // Treat missing/"completed" status as "published" for backward compatibility
        const rawStatus = frontmatter.status || "published";
        const entryStatus = rawStatus === "completed" ? "published" : rawStatus;
        if (status && entryStatus !== status) continue;


        entries.push({
          frontmatter,
          content,
          filePath,
          type: t,
          slug: frontmatter.slug || fileName,
        });
      } catch (err) {
        console.error(`Error reading MDX file ${filePath}:`, err);
      }
    }
  }

  entries.sort(
    (a, b) =>
      new Date(b.frontmatter.updatedAt).getTime() -
      new Date(a.frontmatter.updatedAt).getTime()
  );

  return entries;
}

export function getEntry(type: ContentType, slug: string): MdxEntry | null {
  try {
    // First try the flat path (content/<type>/<slug>.mdx)
    const flatPath = getFilePath(type, slug);
    if (fs.existsSync(flatPath)) {
      const raw = fs.readFileSync(flatPath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as MdxFrontmatter;
      frontmatter.slug = frontmatter.slug || slug;
      frontmatter.type = frontmatter.type || type;        frontmatter.status = (frontmatter.status === "completed" ? "published" : frontmatter.status) || "published";
        return { frontmatter, content, filePath: flatPath, type, slug: frontmatter.slug || slug };

    }

    // Fallback: search recursively through subdirectories
    const dir = getContentDir(type);
    const files = walkMdxFiles(dir);
    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as MdxFrontmatter;
      const fileSlug = frontmatter.slug || path.basename(filePath).replace(/\.mdx$/, "");
      if (fileSlug === slug) {
        frontmatter.slug = frontmatter.slug || slug;
        frontmatter.type = frontmatter.type || type;
        frontmatter.status = (frontmatter.status === "completed" ? "published" : frontmatter.status) || "published";
        return { frontmatter, content, filePath, type, slug: frontmatter.slug || slug };

      }
    }

    return null;
  } catch {
    return null;
  }
}

export function createEntry(
  type: ContentType,
  slug: string,
  frontmatter: Partial<MdxFrontmatter>,
  content: string
): MdxEntry {
  const now = new Date().toISOString();
  const defaultFm = createDefaultFrontmatter(
    frontmatter.title || slug,
    slug,
    type
  );

  const merged: MdxFrontmatter = {
    ...defaultFm,
    ...frontmatter,
    slug,
    type,
    createdAt: frontmatter.createdAt || now,
    updatedAt: now,
  };

  const mdxContent = serializeMdx(merged, content);
  const filePath = getFilePath(type, slug);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  return { frontmatter: merged, content, filePath, type, slug };
}

export function updateEntry(
  type: ContentType,
  slug: string,
  frontmatter: Partial<MdxFrontmatter>,
  content: string
): MdxEntry | null {
  const existing = getEntry(type, slug);
  if (!existing) return null;

  const now = new Date().toISOString();
  const merged: MdxFrontmatter = {
    ...existing.frontmatter,
    ...frontmatter,
    slug,
    type,
    createdAt: existing.frontmatter.createdAt,
    updatedAt: now,
  };

  const mdxContent = serializeMdx(merged, content);
  const filePath = getFilePath(type, slug);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  return { frontmatter: merged, content, filePath, type, slug };
}

export function deleteEntry(type: ContentType, slug: string): boolean {
  const filePath = getFilePath(type, slug);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function duplicateEntry(
  type: ContentType,
  slug: string,
  newSlug: string
): MdxEntry | null {
  const existing = getEntry(type, slug);
  if (!existing) return null;

  return createEntry(
    type,
    newSlug,
    {
      ...existing.frontmatter,
      title: `${existing.frontmatter.title} (Copy)`,
      status: "draft",
    },
    existing.content
  );
}

// ─── Serialization ───────────────────────────────────

export function serializeMdx(
  frontmatter: MdxFrontmatter,
  content: string
): string {
  const fm: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value !== undefined && value !== null && value !== "") {
      fm[key] = value;
    }
  }

  const fmYaml = matter.stringify("", fm).trim();
  return `${fmYaml}\n\n${content.trim()}\n`;
}

// ─── Search ──────────────────────────────────────────

export function searchEntries(query: string, types?: ContentType[]): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const entries = listEntries();
  const results: SearchResult[] = [];

  for (const entry of entries) {
    if (types && !types.includes(entry.type)) continue;

    const fm = entry.frontmatter;
    const searchableText = [
      fm.title,
      fm.category,
      fm.course,
      fm.department,
      fm.subcategory,
      ...fm.tags,
      ...fm.technologies,
      ...fm.software,
      ...fm.hardware,
      ...fm.tools,
      ...fm.skills,
      fm.seoDescription,
      ...(fm.keywords || []),
      entry.content,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!searchableText.includes(lowerQuery)) continue;

    const matches: string[] = [];
    if (fm.title.toLowerCase().includes(lowerQuery)) matches.push("title");
    if (entry.content.toLowerCase().includes(lowerQuery)) matches.push("content");
    if (fm.tags.some((t) => t.toLowerCase().includes(lowerQuery))) matches.push("tags");
    if (fm.technologies.some((t) => t.toLowerCase().includes(lowerQuery))) matches.push("technologies");
    if (fm.course?.toLowerCase().includes(lowerQuery)) matches.push("course");
    if (fm.department?.toLowerCase().includes(lowerQuery)) matches.push("department");
    if (fm.skills.some((s) => s.toLowerCase().includes(lowerQuery))) matches.push("skills");

    results.push({
      entry,
      relevance: matches.length,
      matches,
    });
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

// ─── Related Content ─────────────────────────────────

export function findRelatedEntries(
  entry: MdxEntry,
  maxResults = 5
): MdxEntry[] {
  const all = listEntries().filter(
    (e) => e.slug !== entry.slug || e.type !== entry.type
  );

  const fm = entry.frontmatter;
  const scored = all.map((other) => {
    let score = 0;
    const ofm = other.frontmatter;

    if (
      fm.category &&
      ofm.category &&
      fm.category.toLowerCase() === ofm.category.toLowerCase()
    ) {
      score += 5;
    }

    if (
      fm.course &&
      ofm.course &&
      fm.course.toLowerCase() === ofm.course.toLowerCase()
    ) {
      score += 4;
    }

    const sharedTechs = fm.technologies.filter((t) =>
      ofm.technologies.some((ot) => ot.toLowerCase() === t.toLowerCase())
    );
    score += sharedTechs.length * 2;

    const sharedTags = fm.tags.filter((t) =>
      ofm.tags.some((ot) => ot.toLowerCase() === t.toLowerCase())
    );
    score += sharedTags.length * 1.5;

    const sharedSkills = fm.skills.filter((s) =>
      ofm.skills.some((os) => os.toLowerCase() === s.toLowerCase())
    );
    score += sharedSkills.length * 1;

    if (
      fm.department &&
      ofm.department &&
      fm.department.toLowerCase() === ofm.department.toLowerCase()
    ) {
      score += 3;
    }

    return { entry: other, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.entry);
}

// ─── Validation ──────────────────────────────────────

export function validateEntry(
  type: ContentType,
  slug: string,
  frontmatter: Partial<MdxFrontmatter>,
  content: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!frontmatter.title?.trim()) {
    errors.push("Title is required");
  }

  if (!slug.trim()) {
    errors.push("Slug is required");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push("Slug must contain only lowercase letters, numbers, and hyphens");
  }

  if (
    frontmatter.status &&
    !["draft", "published", "archived", "completed"].includes(frontmatter.status)
  ) {
    errors.push("Status must be one of: draft, published, archived, completed");
  }

  if (!content.trim()) {
    warnings.push("Content is empty");
  }

  if (!frontmatter.category?.trim()) {
    warnings.push("Category is not set");
  }

  if (!frontmatter.tags?.length) {
    warnings.push("No tags defined");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
