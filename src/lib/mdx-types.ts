// ─── Content Types ───────────────────────────────────

export type ContentType =
  | "labs"
  | "projects"
  | "client-work"
  | "automation"
  | "courses"
  | "research"
  | "certifications"
  | "learning"
  | "blog";

export const ALL_CONTENT_TYPES: ContentType[] = [
  "labs",
  "projects",
  "client-work",
  "automation",
  "courses",
  "research",
  "certifications",
  "learning",
  "blog",
];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  labs: "Laboratory Manuals",
  projects: "Projects",
  "client-work": "Client Work",
  automation: "Automation Workflows",
  courses: "Courses",
  research: "Research",
  certifications: "Certifications",
  learning: "Learning Notes",
  blog: "Blog Posts",
};

// ─── Frontmatter Type ────────────────────────────────

export interface MdxFrontmatter {
  title: string;
  slug: string;
  type: string;
  category: string;
  subcategory?: string;
  course?: string;
  courseCode?: string;
  department?: string;
  semester?: string;
  year?: string;
  session?: string;
  labNumber?: string;
  sessionNumber?: string;
  difficulty?: string;
  status: "draft" | "published" | "archived" | "completed";
  featured: boolean;
  tags: string[];
  technologies: string[];
  software: string[];
  hardware: string[];
  tools: string[];
  skills: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  canonicalURL?: string;
  ogImage?: string;
  // BEL / TC-106 specific fields
  domain?: string;
  clo?: string;
  laboratorySession?: string;
  circuits?: string[];
  components?: string[];
  programmingLanguages?: string[];
  issuer?: string;
  issuedDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialURL?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Entry Type ──────────────────────────────────────

export interface MdxEntry {
  frontmatter: MdxFrontmatter;
  content: string;
  filePath: string;
  type: ContentType;
  slug: string;
}

// ─── Utility Types ───────────────────────────────────

export interface SearchResult {
  entry: MdxEntry;
  relevance: number;
  matches: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MdxImportResult {
  totalFiles: number;
  mdxFilesCreated: number;
  categoriesCreated: number;
  entriesCreated: number;
  warnings: string[];
  errors: string[];
  completionPercentage: number;
}

// ─── Default Frontmatter ─────────────────────────────

export function createDefaultFrontmatter(
  title: string,
  slug: string,
  type: ContentType
): MdxFrontmatter {
  const now = new Date().toISOString();
  return {
    title,
    slug,
    type,
    category: "",
    status: "draft",
    featured: false,
    tags: [],
    technologies: [],
    software: [],
    hardware: [],
    tools: [],
    skills: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Slug Generator ──────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
