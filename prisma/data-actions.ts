"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { slugify, parseJsonArray, stringifyJsonArray } from "@/lib/utils";

// ─── Dashboard Stats ─────────────────────────────────

export async function getDashboardStats() {
  const [
    projectCount,
    publishedCount,
    draftCount,
    blogCount,
    messageCount,
    unreadMessages,
    labCount,
    workflowCount,
    certCount,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.project.count({ where: { status: "DRAFT" } }),
    db.blogPost.count({ where: { published: true } }),
    db.message.count(),
    db.message.count({ where: { read: false } }),
    db.lab.count({ where: { status: "PUBLISHED" } }),
    db.workflow.count({ where: { status: "PUBLISHED" } }),
    db.certification.count(),
  ]);

  return {
    projects: { total: projectCount, published: publishedCount, drafts: draftCount },
    blogPosts: blogCount,
    messages: { total: messageCount, unread: unreadMessages },
    labs: labCount,
    workflows: workflowCount,
    certifications: certCount,
  };
}

// ─── Helper ──────────────────────────────────────────

async function ensureUniqueSlug(model: "project" | "blogPost" | "lab" | "workflow" | "certification" | "achievement" | "client" | "currentLearning" | "skill" | "skillCategory" | "category" | "tag" | "technology" | "navigationItem" | "socialLink", baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const where: Record<string, string> = { slug };
    if (excludeId) (where as Record<string, unknown>).NOT = { id: excludeId };
    const existing = await (db[model] as any).findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// ─── Owner ───────────────────────────────────────────

export async function getOwner() {
  const owner = await db.owner.findFirst();
  return owner;
}

export async function upsertOwner(data: {
  name: string;
  title: string;
  tagline?: string;
  bio?: string;
  avatar?: string;
  resume?: string;
  email?: string;
  phone?: string;
  location?: string;
  university?: string;
  department?: string;
  batch?: string;
  website?: string;
}) {
  const existing = await db.owner.findFirst();
  if (existing) {
    return db.owner.update({ where: { id: existing.id }, data });
  }
  return db.owner.create({ data });
}

// ─── Projects CRUD ───────────────────────────────────

const projectInclude = {
  category: true,
  client: true,
  tags: { include: { tag: true } },
  gallery: { orderBy: { order: "asc" as const } },
  timeline: { orderBy: { order: "asc" as const } },
  seo: true,
};

export type ProjectListData = {
  id: string; title: string; slug: string; subtitle: string | null; summary: string | null;
  shortDescription: string | null; thumbnail: string | null; difficulty: string | null;
  status: string; featured: boolean; pinned: boolean; visibility: string;
  category: { id: string; name: string; slug: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
  year: number | null; createdAt: Date; updatedAt: Date;
  technologies: string[];
};

export async function getProjects(options?: {
  status?: string; featured?: boolean; categoryId?: string;
  search?: string; limit?: number; offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.featured !== undefined) where.featured = options.featured;
  if (options?.categoryId) where.categoryId = options.categoryId;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { description: { contains: options.search } },
      { summary: { contains: options.search } },
    ];
  }

  const [projects, total] = await Promise.all([
    db.project.findMany({
      where,
      include: projectInclude,
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: options?.limit ?? 100,
      skip: options?.offset ?? 0,
    }),
    db.project.count({ where }),
  ]);

  return {
    projects: projects.map(formatProjectList),
    total,
  };
}

export async function getPublishedProjects() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", visibility: "PUBLIC" },
    include: projectInclude,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return projects.map(formatProjectList);
}

export async function getFeaturedProjects() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", featured: true, visibility: "PUBLIC" },
    include: projectInclude,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
  return projects.map(formatProjectList);
}

export async function getProjectBySlug(slug: string, includeDrafts = false) {
  const where: Record<string, unknown> = { slug };
  if (!includeDrafts) where.status = "PUBLISHED";
  where.visibility = includeDrafts ? undefined : "PUBLIC";

  const project = await db.project.findFirst({
    where,
    include: {
      ...projectInclude,
      relatedProjects: true,
    },
  });
  if (!project) return null;
  return formatProjectDetail(project);
}

export async function getRelatedProjects(slug: string, categoryId?: string | null) {
  if (!categoryId) return [];
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", categoryId, slug: { not: slug }, visibility: "PUBLIC" },
    include: projectInclude,
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return projects.map(formatProjectList);
}

function formatProjectList(p: any): ProjectListData {
  return {
    id: p.id, title: p.title, slug: p.slug,
    subtitle: p.subtitle, summary: p.summary,
    shortDescription: p.shortDescription,
    thumbnail: p.thumbnail || p.gallery?.[0]?.url || null,
    difficulty: p.difficulty, status: p.status,
    featured: p.featured, pinned: p.pinned, visibility: p.visibility,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
    tags: p.tags?.map((pt: any) => ({ tag: { id: pt.tag.id, name: pt.tag.name, slug: pt.tag.slug } })) ?? [],
    year: p.year, createdAt: p.createdAt, updatedAt: p.updatedAt,
    technologies: parseJsonArray(p.technologies),
  };
}

function formatProjectDetail(p: any) {
  return {
    ...formatProjectList(p),
    description: p.description,
    problemStatement: p.problemStatement,
    solution: p.solution,
    background: p.background,
    objectives: parseJsonArray(p.objectives),
    features: parseJsonArray(p.features),
    architecture: p.architecture,
    folderStructure: p.folderStructure,
    technologyStack: parseJsonArray(p.technologyStack),
    hardware: parseJsonArray(p.hardware),
    software: parseJsonArray(p.software),
    tools: parseJsonArray(p.tools),
    subCategory: p.subCategory,
    client: p.client ? { id: p.client.id, name: p.client.name, slug: p.client.slug } : null,
    course: p.course, semester: p.semester, year: p.year,
    gallery: p.gallery?.map((img: any) => ({ url: img.url, alt: img.alt, caption: img.caption })) ?? [],
    screenshots: parseJsonArray(p.screenshots),
    videos: parseJsonArray(p.videos),
    demoLink: p.demoLink, githubLink: p.githubLink, linkedinLink: p.linkedinLink,
    documentation: p.documentation, caseStudy: p.caseStudy,
    futureImprovements: p.futureImprovements,
    testing: p.testing, deployment: p.deployment, performance: p.performance,
    seoDescription: p.seoDescription,
    metrics: parseJsonArray(p.metrics),
    skillsLearned: parseJsonArray(p.skillsLearned),
    lessonsLearned: p.lessonsLearned,
    relatedProjects: parseJsonArray(p.relatedProjects),
    searchKeywords: parseJsonArray(p.searchKeywords),
    icon: p.icon, color: p.color,
    seo: p.seo,
    timeline: p.timeline?.map((t: any) => ({ date: t.date, title: t.title, description: t.description })) ?? [],
    publishedAt: p.publishedAt, version: p.version,
  };
}

export type CreateProjectInput = {
  title: string; subtitle?: string; summary?: string; description: string;
  shortDescription?: string; problemStatement?: string; solution?: string;
  background?: string; objectives?: string[]; features?: string[];
  architecture?: string; folderStructure?: string;
  technologyStack?: string[]; hardware?: string[]; software?: string[]; tools?: string[];
  difficulty?: string; categoryId?: string; subCategory?: string;
  clientId?: string; course?: string; semester?: string; year?: number;
  thumbnail?: string; banner?: string; screenshots?: string[];
  demoLink?: string; githubLink?: string; linkedinLink?: string;
  documentation?: string; caseStudy?: string;
  futureImprovements?: string; testing?: string; deployment?: string;
  performance?: string; seoDescription?: string; metrics?: string[];
  skillsLearned?: string[]; lessonsLearned?: string;
  tags?: string[]; searchKeywords?: string[];
  featured?: boolean; pinned?: boolean; visibility?: string;
  icon?: string; color?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export async function createProject(data: CreateProjectInput) {
  const slug = await ensureUniqueSlug("project", slugify(data.title));
  const project = await db.project.create({
    data: {
      title: data.title, slug, subtitle: data.subtitle ?? null, summary: data.summary ?? null,
      description: data.description, shortDescription: data.shortDescription ?? null,
      problemStatement: data.problemStatement ?? null, solution: data.solution ?? null,
      background: data.background ?? null,
      objectives: stringifyJsonArray(data.objectives ?? []),
      features: stringifyJsonArray(data.features ?? []),
      architecture: data.architecture ?? null, folderStructure: data.folderStructure ?? null,
      technologyStack: stringifyJsonArray(data.technologyStack ?? []),
      hardware: stringifyJsonArray(data.hardware ?? []),
      software: stringifyJsonArray(data.software ?? []),
      tools: stringifyJsonArray(data.tools ?? []),
      difficulty: data.difficulty ?? null, categoryId: data.categoryId ?? null,
      subCategory: data.subCategory ?? null,
      clientId: data.clientId ?? null, course: data.course ?? null,
      semester: data.semester ?? null, year: data.year ?? null,
      thumbnail: data.thumbnail ?? null, banner: data.banner ?? null,
      screenshots: stringifyJsonArray(data.screenshots ?? []),
      demoLink: data.demoLink ?? null, githubLink: data.githubLink ?? null,
      linkedinLink: data.linkedinLink ?? null, documentation: data.documentation ?? null,
      caseStudy: data.caseStudy ?? null,
      futureImprovements: data.futureImprovements ?? null, testing: data.testing ?? null,
      deployment: data.deployment ?? null, performance: data.performance ?? null,
      seoDescription: data.seoDescription ?? null,
      metrics: stringifyJsonArray(data.metrics ?? []),
      skillsLearned: stringifyJsonArray(data.skillsLearned ?? []),
      lessonsLearned: data.lessonsLearned ?? null,
      searchKeywords: stringifyJsonArray(data.searchKeywords ?? []),
      featured: data.featured ?? false, pinned: data.pinned ?? false,
      visibility: data.visibility ?? "PUBLIC", icon: data.icon ?? null, color: data.color ?? null,
      status: data.status ?? "DRAFT",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      technologies: stringifyJsonArray(data.skillsLearned ?? []),
    },
  });

  // Handle tags
  if (data.tags && data.tags.length > 0) {
    for (const tagName of data.tags) {
      const tagSlug = slugify(tagName);
      let tag = await db.tag.findUnique({ where: { slug: tagSlug } });
      if (!tag) tag = await db.tag.create({ data: { name: tagName, slug: tagSlug } });
      await db.projectTag.create({ data: { projectId: project.id, tagId: tag.id } });
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return project;
}

export async function updateProject(id: string, data: Partial<CreateProjectInput>) {
  const updateData: Record<string, unknown> = {};
  if (data.title) { updateData.slug = await ensureUniqueSlug("project", slugify(data.title), id); updateData.title = data.title; }
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle ?? null;
  if (data.summary !== undefined) updateData.summary = data.summary ?? null;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription ?? null;
  if (data.problemStatement !== undefined) updateData.problemStatement = data.problemStatement ?? null;
  if (data.solution !== undefined) updateData.solution = data.solution ?? null;
  if (data.background !== undefined) updateData.background = data.background ?? null;
  if (data.objectives) updateData.objectives = stringifyJsonArray(data.objectives);
  if (data.features) updateData.features = stringifyJsonArray(data.features);
  if (data.architecture !== undefined) updateData.architecture = data.architecture ?? null;
  if (data.folderStructure !== undefined) updateData.folderStructure = data.folderStructure ?? null;
  if (data.technologyStack) updateData.technologyStack = stringifyJsonArray(data.technologyStack);
  if (data.hardware) updateData.hardware = stringifyJsonArray(data.hardware);
  if (data.software) updateData.software = stringifyJsonArray(data.software);
  if (data.tools) updateData.tools = stringifyJsonArray(data.tools);
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty ?? null;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId ?? null;
  if (data.subCategory !== undefined) updateData.subCategory = data.subCategory ?? null;
  if (data.clientId !== undefined) updateData.clientId = data.clientId ?? null;
  if (data.course !== undefined) updateData.course = data.course ?? null;
  if (data.semester !== undefined) updateData.semester = data.semester ?? null;
  if (data.year !== undefined) updateData.year = data.year ?? null;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail ?? null;
  if (data.banner !== undefined) updateData.banner = data.banner ?? null;
  if (data.screenshots) updateData.screenshots = stringifyJsonArray(data.screenshots);
  if (data.demoLink !== undefined) updateData.demoLink = data.demoLink ?? null;
  if (data.githubLink !== undefined) updateData.githubLink = data.githubLink ?? null;
  if (data.linkedinLink !== undefined) updateData.linkedinLink = data.linkedinLink ?? null;
  if (data.documentation !== undefined) updateData.documentation = data.documentation ?? null;
  if (data.caseStudy !== undefined) updateData.caseStudy = data.caseStudy ?? null;
  if (data.futureImprovements !== undefined) updateData.futureImprovements = data.futureImprovements ?? null;
  if (data.testing !== undefined) updateData.testing = data.testing ?? null;
  if (data.deployment !== undefined) updateData.deployment = data.deployment ?? null;
  if (data.performance !== undefined) updateData.performance = data.performance ?? null;
  if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription ?? null;
  if (data.metrics) updateData.metrics = stringifyJsonArray(data.metrics);
  if (data.skillsLearned) updateData.skillsLearned = stringifyJsonArray(data.skillsLearned);
  if (data.lessonsLearned !== undefined) updateData.lessonsLearned = data.lessonsLearned ?? null;
  if (data.searchKeywords) updateData.searchKeywords = stringifyJsonArray(data.searchKeywords);
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.pinned !== undefined) updateData.pinned = data.pinned;
  if (data.visibility !== undefined) updateData.visibility = data.visibility;
  if (data.icon !== undefined) updateData.icon = data.icon ?? null;
  if (data.color !== undefined) updateData.color = data.color ?? null;
  if (data.status) { updateData.status = data.status; updateData.publishedAt = data.status === "PUBLISHED" ? new Date() : null; }
  if (data.skillsLearned) updateData.technologies = stringifyJsonArray(data.skillsLearned);

  const project = await db.project.update({ where: { id }, data: updateData });
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${project.slug}`);
  return project;
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

// ─── Labs CRUD ───────────────────────────────────────

export async function getLabs(options?: { status?: string; category?: string; featured?: boolean }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.category) where.category = options.category;
  if (options?.featured !== undefined) where.featured = options.featured;

  return db.lab.findMany({
    where,
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createLab(data: {
  title: string; summary?: string; description?: string; category?: string;
  course?: string; semester?: string; year?: number;
  objectives?: string[]; equipment?: string[]; procedure?: string;
  observations?: string; results?: string; conclusion?: string;
  technologies?: string[]; githubLink?: string; reportLink?: string;
  schematicLink?: string; images?: string[]; difficulty?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"; featured?: boolean;
}) {
  const slug = await ensureUniqueSlug("lab", slugify(data.title));
  return db.lab.create({
    data: {
      title: data.title, slug, summary: data.summary ?? null,
      description: data.description ?? null, category: data.category ?? null,
      course: data.course ?? null, semester: data.semester ?? null, year: data.year ?? null,
      objectives: stringifyJsonArray(data.objectives ?? []),
      equipment: stringifyJsonArray(data.equipment ?? []),
      procedure: data.procedure ?? null, observations: data.observations ?? null,
      results: data.results ?? null, conclusion: data.conclusion ?? null,
      technologies: stringifyJsonArray(data.technologies ?? []),
      githubLink: data.githubLink ?? null, reportLink: data.reportLink ?? null,
      schematicLink: data.schematicLink ?? null,
      images: stringifyJsonArray(data.images ?? []),
      difficulty: data.difficulty ?? null, status: data.status ?? "DRAFT",
      featured: data.featured ?? false,
    },
  });
}

export async function updateLab(id: string, data: Record<string, unknown>) {
  return db.lab.update({ where: { id }, data });
}

export async function deleteLab(id: string) {
  await db.lab.delete({ where: { id } });
  revalidatePath("/admin/labs");
}

// ─── Workflows CRUD ──────────────────────────────────

export async function getWorkflows(options?: { status?: string; category?: string }) {
  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.category) where.category = options.category;
  return db.workflow.findMany({
    where, orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function createWorkflow(data: {
  title: string; summary?: string; description?: string;
  trigger?: string; purpose?: string; services?: string[];
  flowDiagram?: string; nodes?: string[]; inputs?: string[];
  outputs?: string[]; futureImprovements?: string;
  difficulty?: string; tools?: string[]; technologies?: string[];
  category?: string; status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const slug = await ensureUniqueSlug("workflow", slugify(data.title));
  return db.workflow.create({
    data: {
      title: data.title, slug, summary: data.summary ?? null,
      description: data.description ?? null, trigger: data.trigger ?? null,
      purpose: data.purpose ?? null, services: stringifyJsonArray(data.services ?? []),
      flowDiagram: data.flowDiagram ?? null,
      nodes: stringifyJsonArray(data.nodes ?? []),
      inputs: stringifyJsonArray(data.inputs ?? []),
      outputs: stringifyJsonArray(data.outputs ?? []),
      futureImprovements: data.futureImprovements ?? null,
      difficulty: data.difficulty ?? null, tools: stringifyJsonArray(data.tools ?? []),
      technologies: stringifyJsonArray(data.technologies ?? []),
      category: data.category ?? null, status: data.status ?? "DRAFT",
    },
  });
}

export async function updateWorkflow(id: string, data: Record<string, unknown>) {
  return db.workflow.update({ where: { id }, data });
}

export async function deleteWorkflow(id: string) {
  await db.workflow.delete({ where: { id } });
  revalidatePath("/admin/workflows");
}

// ─── Certifications CRUD ─────────────────────────────

export async function getCertifications() {
  return db.certification.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }, { issueDate: "desc" }] });
}

export async function createCertification(data: {
  title: string; issuer: string; description?: string;
  issueDate?: Date; expiryDate?: Date; credentialId?: string;
  credentialUrl?: string; image?: string; skills?: string[];
  category?: string; featured?: boolean;
}) {
  const slug = await ensureUniqueSlug("certification", slugify(data.title));
  return db.certification.create({
    data: {
      title: data.title, issuer: data.issuer, slug,
      description: data.description ?? null, issueDate: data.issueDate ?? null,
      expiryDate: data.expiryDate ?? null, credentialId: data.credentialId ?? null,
      credentialUrl: data.credentialUrl ?? null, image: data.image ?? null,
      skills: stringifyJsonArray(data.skills ?? []),
      category: data.category ?? null, featured: data.featured ?? false,
    },
  });
}

export async function updateCertification(id: string, data: Record<string, unknown>) {
  return db.certification.update({ where: { id }, data });
}

export async function deleteCertification(id: string) {
  await db.certification.delete({ where: { id } });
  revalidatePath("/admin/certifications");
}

// ─── Achievements CRUD ───────────────────────────────

export async function getAchievements() {
  return db.achievement.findMany({ orderBy: [{ featured: "desc" }, { date: "desc" }] });
}

export async function createAchievement(data: {
  title: string; description?: string; date?: Date;
  category?: string; icon?: string; issuer?: string; link?: string; image?: string;
}) {
  const slug = await ensureUniqueSlug("achievement", slugify(data.title));
  return db.achievement.create({
    data: { title: data.title, slug, description: data.description ?? null, date: data.date ?? null, category: data.category ?? null, icon: data.icon ?? null, issuer: data.issuer ?? null, link: data.link ?? null, image: data.image ?? null },
  });
}

// ─── Categories CRUD ─────────────────────────────────

export async function getAllCategories() {
  return db.category.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(name: string, data?: { description?: string; icon?: string; color?: string; parentId?: string }) {
  const slug = slugify(name);
  return db.category.create({ data: { name, slug, ...data } });
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return db.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ─── Tags CRUD ────────────────────────────────────────

export async function getAllTags() {
  return db.tag.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createTag(name: string, color?: string) {
  const slug = slugify(name);
  return db.tag.upsert({
    where: { slug },
    create: { name, slug, color: color ?? null },
    update: { name, color: color ?? null },
  });
}

// ─── Skills CRUD ──────────────────────────────────────

export async function getSkillCategories() {
  return db.skillCategory.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
}

export async function createSkillCategory(name: string, data?: { icon?: string; color?: string }) {
  const slug = slugify(name);
  return db.skillCategory.create({ data: { name, slug, ...data } });
}

export async function createSkill(data: { name: string; icon?: string; color?: string; level?: number; categoryId?: string }) {
  const slug = slugify(data.name);
  return db.skill.upsert({
    where: { slug },
    create: { name: data.name, slug, icon: data.icon ?? null, color: data.color ?? null, level: data.level ?? null, categoryId: data.categoryId ?? null },
    update: { icon: data.icon ?? null, color: data.color ?? null, level: data.level ?? null, categoryId: data.categoryId ?? null },
  });
}

// ─── Clients CRUD ─────────────────────────────────────

export async function getAllClients() {
  return db.client.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createClient(data: { name: string; logo?: string; website?: string; industry?: string; description?: string; color?: string }) {
  const slug = await ensureUniqueSlug("client", slugify(data.name));
  return db.client.create({ data: { ...data, slug } });
}

// ─── Education CRUD ───────────────────────────────────

export async function getEducation() {
  return db.education.findMany({ orderBy: [{ order: "asc" }, { startYear: "desc" }] });
}

export async function upsertEducation(data: {
  institution: string; degree: string; field?: string;
  startYear: number; endYear?: number; current?: boolean;
  gpa?: string; description?: string; logo?: string;
}) {
  return db.education.create({ data });
}

// ─── Experience CRUD ─────────────────────────────────

export async function getExperience() {
  return db.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
}

export async function createExperience(data: {
  company: string; role: string; description?: string;
  startDate: Date; endDate?: Date; current?: boolean;
  location?: string; type?: string; logo?: string;
  highlights?: string[]; technologies?: string[];
}) {
  return db.experience.create({
    data: {
      ...data,
      highlights: stringifyJsonArray(data.highlights ?? []),
      technologies: stringifyJsonArray(data.technologies ?? []),
      startDate: data.startDate, endDate: data.endDate ?? null,
      current: data.current ?? false,
    },
  });
}

// ─── Current Learning CRUD ───────────────────────────

export async function getCurrentLearning() {
  return db.currentLearning.findMany({ orderBy: { order: "asc" } });
}

export async function createCurrentLearning(data: {
  technology: string; description?: string; progress?: number;
  resources?: string[]; notes?: string; relatedProjects?: string[];
  startDate?: Date; status?: string;
}) {
  const slug = await ensureUniqueSlug("currentLearning", slugify(data.technology));
  return db.currentLearning.create({
    data: {
      technology: data.technology, slug, description: data.description ?? null,
      progress: data.progress ?? null, resources: stringifyJsonArray(data.resources ?? []),
      notes: data.notes ?? null, relatedProjects: stringifyJsonArray(data.relatedProjects ?? []),
      startDate: data.startDate ?? null, status: data.status ?? "LEARNING",
    },
  });
}

// ─── Navigation & Social Links CRUD ──────────────────

export async function getNavigationItems(type?: string) {
  const where: Record<string, unknown> = { visible: true };
  if (type) where.type = type;
  return db.navigationItem.findMany({
    where, orderBy: { order: "asc" },
  });
}

export async function getSocialLinks() {
  return db.socialLink.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

// ─── Homepage Sections CRUD ──────────────────────────

export async function getHomepageSections() {
  return db.homepageSection.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export async function saveHomepageSection(key: string, data: { title?: string; subtitle?: string; content?: string; visible?: boolean; order?: number }) {
  return db.homepageSection.upsert({
    where: { key },
    update: data,
    create: { key, ...data },
  });
}

// ─── Messages ────────────────────────────────────────

export async function getMessages() {
  return db.message.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string) {
  await db.message.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await db.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export type CreateMessageInput = { name: string; email: string; subject?: string; message: string };

export async function createMessage(data: CreateMessageInput) {
  await db.message.create({ data: { name: data.name, email: data.email, subject: data.subject ?? null, message: data.message } });
  revalidatePath("/admin/messages");
}

// ─── Blog Posts ──────────────────────────────────────

export async function getBlogPosts() {
  return db.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getBlogPost(id: string) {
  return db.blogPost.findUnique({ where: { id }, include: { seo: true } });
}

export async function updateBlogPostPublish(id: string, published: boolean) {
  return db.blogPost.update({ where: { id }, data: { published, publishedAt: published ? new Date() : null } });
}

export type CreateBlogPostInput = { title: string; content: string; excerpt?: string; coverImage?: string; tags?: string[]; published?: boolean };

export async function createBlogPost(data: CreateBlogPostInput) {
  const slug = await ensureUniqueSlug("blogPost", slugify(data.title));
  return db.blogPost.create({
    data: {
      title: data.title, slug, content: data.content, excerpt: data.excerpt ?? null,
      coverImage: data.coverImage ?? null, tags: stringifyJsonArray(data.tags ?? []),
      published: data.published ?? false, publishedAt: data.published ? new Date() : null,
    },
  });
}

export async function updateBlogPost(id: string, data: Partial<CreateBlogPostInput>) {
  const updateData: Record<string, unknown> = {};
  if (data.title) { updateData.slug = await ensureUniqueSlug("blogPost", slugify(data.title), id); updateData.title = data.title; }
  if (data.content !== undefined) updateData.content = data.content;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt ?? null;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage ?? null;
  if (data.tags) updateData.tags = stringifyJsonArray(data.tags);
  if (data.published !== undefined) { updateData.published = data.published; updateData.publishedAt = data.published ? new Date() : null; }
  return db.blogPost.update({ where: { id }, data: updateData });
}

export async function deleteBlogPost(id: string) {
  await db.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

// ─── Settings ────────────────────────────────────────

export async function getSettings() {
  const settings = await db.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

export async function saveSetting(key: string, value: string) {
  await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  revalidatePath("/admin/settings");
}

// ─── Media ────────────────────────────────────────────

export async function getMedia() {
  return db.media.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMedia(data: {
  filename: string; url: string; type: string; mimeType?: string;
  size?: number; width?: number; height?: number; alt?: string; folder?: string;
}) {
  return db.media.create({ data });
}

export async function deleteMedia(id: string) {
  await db.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}

export async function updateMedia(id: string, data: { alt?: string; folder?: string; caption?: string }) {
  return db.media.update({ where: { id }, data });
}
