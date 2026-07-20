import { db } from "@/lib/db";
import { cache } from "react";
import { parseJsonArray } from "@/lib/utils";
import type { ProjectListData } from "prisma/data-actions";

// ─── Data Types ──────────────────────────────────────

export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type Complexity = "beginner" | "intermediate" | "advanced" | "expert";

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  shortDescription: string | null;
  technologies: string[];
  technologyStack: { name: string; category?: string; version?: string }[];
  featured: boolean;
  pinned: boolean;
  status: string;
  difficulty: string | null;
  category: { name: string; slug: string } | null;
  tags: { tag: { name: string; slug: string } }[];
  thumbnail: string | null;
  year: number | null;
  createdAt: Date;
  hardware: string[];
  software: string[];
  tools: string[];
}

export interface ProjectDetail extends ProjectListItem {
  description: string;
  problemStatement: string | null;
  solution: string | null;
  background: string | null;
  architecture: string | null;
  objectives: string[];
  features: string[];
  lessonsLearned: string | null;
  demoLink: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  videoUrl: string | null;
  documentation: string | null;
  caseStudy: string | null;
  gallery: { url: string; alt: string | null; caption: string | null }[];
  screenshots: { url: string; alt?: string; caption?: string }[];
  timeline: { date: Date; title: string; description: string | null }[];
  skillsLearned: string[];
  futureImprovements: string | null;
  testing: string | null;
  deployment: string | null;
  performance: string | null;
  metrics: { label: string; value: string }[];
  client: { id: string; name: string; slug: string } | null;
  course: string | null;
  semester: string | null;
  year: number | null;
  searchKeywords: string[];
  seo: { title?: string | null; description?: string | null; ogImage?: string | null } | null;
}

// ─── Include config ──────────────────────────────────

const includeConfig = {
  category: { select: { name: true, slug: true } },
  tags: { select: { tag: { select: { name: true, slug: true } } } },
  gallery: { select: { url: true, alt: true, caption: true }, orderBy: { order: "asc" as const } },
  timeline: { select: { date: true, title: true, description: true }, orderBy: { order: "asc" as const } },
  seo: { select: { title: true, description: true, ogImage: true } },
};

// ─── Main Queries ────────────────────────────────────

export const getPublishedProjects = cache(async (): Promise<ProjectListItem[]> => {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", visibility: "PUBLIC" },
    include: {
      ...includeConfig,
      client: { select: { id: true, name: true, slug: true } },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return projects.map(formatListItem);
});

export const getFeaturedProjects = cache(async (): Promise<ProjectListItem[]> => {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", featured: true, visibility: "PUBLIC" },
    include: includeConfig,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
  return projects.map(formatListItem);
});

export const getProjectBySlug = cache(async (slug: string, includeDrafts = false): Promise<ProjectDetail | null> => {
  const where: Record<string, unknown> = { slug };
  if (!includeDrafts) where.status = "PUBLISHED";
  if (!includeDrafts) where.visibility = "PUBLIC";

  const project = await db.project.findFirst({
    where,
    include: {
      ...includeConfig,
      client: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!project) return null;
  return formatDetail(project);
});

export const getRelatedProjects = cache(async (slug: string, categoryId?: string | null): Promise<ProjectListItem[]> => {
  if (!categoryId) return [];
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", categoryId, slug: { not: slug }, visibility: "PUBLIC" },
    include: includeConfig,
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return projects.map(formatListItem);
});

export const getCategories = cache(async () => {
  return db.category.findMany({
    where: { projects: { some: { status: "PUBLISHED" } } },
    orderBy: { name: "asc" },
  });
});

export const getTags = cache(async () => {
  return db.tag.findMany({
    where: { projects: { some: { project: { status: "PUBLISHED" } } } },
    orderBy: { name: "asc" },
  });
});

// ─── Format Helpers ──────────────────────────────────

function formatListItem(p: any): ProjectListItem {
  return {
    id: p.id, title: p.title, slug: p.slug,
    subtitle: p.subtitle, summary: p.summary,
    shortDescription: p.shortDescription,
    technologies: parseJsonArray(p.technologies),
    technologyStack: parseJsonArray(p.technologyStack),
    featured: p.featured, pinned: p.pinned,
    status: p.status, difficulty: p.difficulty,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    tags: p.tags?.map((pt: any) => ({ tag: { name: pt.tag.name, slug: pt.tag.slug } })) ?? [],
    thumbnail: p.thumbnail || p.gallery?.[0]?.url || null,
    year: p.year, createdAt: p.createdAt,
    hardware: parseJsonArray(p.hardware),
    software: parseJsonArray(p.software),
    tools: parseJsonArray(p.tools),
  };
}

function formatDetail(p: any): ProjectDetail {
  return {
    ...formatListItem(p),
    description: p.description,
    problemStatement: p.problemStatement,
    solution: p.solution,
    background: p.background,
    architecture: p.architecture,
    objectives: parseJsonArray(p.objectives),
    features: parseJsonArray(p.features),
    lessonsLearned: p.lessonsLearned,
    demoLink: p.demoLink, githubLink: p.githubLink, linkedinLink: p.linkedinLink,
    videoUrl: p.videoUrl, documentation: p.documentation, caseStudy: p.caseStudy,
    gallery: p.gallery?.map((img: any) => ({ url: img.url, alt: img.alt, caption: img.caption })) ?? [],
    screenshots: parseJsonArray(p.screenshots),
    timeline: p.timeline?.map((t: any) => ({ date: t.date, title: t.title, description: t.description })) ?? [],
    skillsLearned: parseJsonArray(p.skillsLearned),
    futureImprovements: p.futureImprovements,
    testing: p.testing, deployment: p.deployment, performance: p.performance,
    metrics: parseJsonArray(p.metrics),
    client: p.client ? { id: p.client.id, name: p.client.name, slug: p.client.slug } : null,
    course: p.course, semester: p.semester, year: p.year,
    searchKeywords: parseJsonArray(p.searchKeywords),
    seo: p.seo,
  };
}
