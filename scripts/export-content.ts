/**
 * Export Content Script
 *
 * Queries all data from the database and writes individual JSON files
 * to the content/ directory structure. One file per entry.
 *
 * Usage: npx tsx scripts/export-content.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import { parseJsonArray } from "../src/lib/utils";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const db = new PrismaClient({ adapter });

const CONTENT_DIR = path.resolve(__dirname, "..", "content");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson(subdir: string, slug: string, data: unknown) {
  const dir = path.join(CONTENT_DIR, subdir);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}

async function main() {
  console.log("📤 Exporting content from database to content/ directory...\n");

  // ─── 1. Owner ───────────────────────────────────────
  const owner = await db.owner.findFirst();
  if (owner) {
    writeJson("owner", "profile", owner);
    console.log(`  ✅ owner/profile.json`);
  }

  // ─── 2. Education ───────────────────────────────────
  const education = await db.education.findMany({ orderBy: { startYear: "desc" } });
  for (const e of education) {
    writeJson("education", `${e.institution.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${e.degree.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, e);
  }
  console.log(`  ✅ ${education.length} education files`);

  // ─── 3. Projects ────────────────────────────────────
  const projects = await db.project.findMany({
    include: {
      category: true,
      client: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
      gallery: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
      seo: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let projectCount = 0;
  for (const p of projects) {
    const data: Record<string, unknown> = {
      id: p.id,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle,
      summary: p.summary,
      shortDescription: p.shortDescription,
      description: p.description,
      problemStatement: p.problemStatement,
      solution: p.solution,
      background: p.background,
      objectives: safeParse(p.objectives),
      features: safeParse(p.features),
      architecture: p.architecture,
      folderStructure: p.folderStructure,
      technologyStack: safeParse(p.technologyStack),
      technologies: safeParse(p.technologies),
      hardware: safeParse(p.hardware),
      software: safeParse(p.software),
      tools: safeParse(p.tools),
      difficulty: p.difficulty,
      status: p.status,
      category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
      subCategory: p.subCategory,
      client: p.client ? { id: p.client.id, name: p.client.name, slug: p.client.slug } : null,
      course: p.course,
      semester: p.semester,
      year: p.year,
      thumbnail: p.thumbnail,
      banner: p.banner,
      screenshots: safeParse(p.screenshots),
      gallery: p.gallery.map((g) => ({ url: g.url, alt: g.alt, caption: g.caption, width: g.width, height: g.height })),
      videos: safeParse(p.videos),
      demoLink: p.demoLink,
      githubLink: p.githubLink,
      linkedinLink: p.linkedinLink,
      documentation: p.documentation,
      caseStudy: p.caseStudy,
      futureImprovements: p.futureImprovements,
      testing: p.testing,
      deployment: p.deployment,
      performance: p.performance,
      seoDescription: p.seoDescription,
      metrics: safeParse(p.metrics),
      skillsLearned: safeParse(p.skillsLearned),
      lessonsLearned: p.lessonsLearned,
      tags: p.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug })),
      searchKeywords: safeParse(p.searchKeywords),
      featured: p.featured,
      pinned: p.pinned,
      visibility: p.visibility,
      icon: p.icon,
      color: p.color,
      timeline: p.timeline.map((t) => ({ date: t.date.toISOString(), title: t.title, description: t.description })),
      seo: p.seo ? { title: p.seo.title, description: p.seo.description, ogImage: p.seo.ogImage } : null,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };

    // Remove null/empty fields for cleaner output
    for (const key of Object.keys(data)) {
      if (data[key] === null || data[key] === undefined || (Array.isArray(data[key]) && (data[key] as unknown[]).length === 0)) {
        // Keep some fields even if null for schema completeness
        if (!["summary", "shortDescription", "difficulty", "year", "category"].includes(key)) {
          // delete data[key];  // Uncomment to strip nulls - keeping for schema completeness
        }
      }
    }

    writeJson("projects", p.slug, data);
    projectCount++;
  }
  console.log(`  ✅ ${projectCount} project files`);

  // ─── 4. Labs ────────────────────────────────────────
  const labs = await db.lab.findMany({ orderBy: { createdAt: "desc" } });
  let labCount = 0;
  for (const lab of labs) {
    const data = {
      ...lab,
      objectives: safeParse(lab.objectives),
      equipment: safeParse(lab.equipment),
      technologies: safeParse(lab.technologies),
      images: safeParse(lab.images),
      createdAt: lab.createdAt.toISOString(),
      updatedAt: lab.updatedAt.toISOString(),
    };
    writeJson("labs", lab.slug, data);
    labCount++;
  }
  console.log(`  ✅ ${labCount} lab files`);

  // ─── 5. Workflows ──────────────────────────────────
  const workflows = await db.workflow.findMany({ orderBy: { createdAt: "desc" } });
  let wfCount = 0;
  for (const wf of workflows) {
    const data = {
      ...wf,
      services: safeParse(wf.services),
      nodes: safeParse(wf.nodes),
      inputs: safeParse(wf.inputs),
      outputs: safeParse(wf.outputs),
      tools: safeParse(wf.tools),
      technologies: safeParse(wf.technologies),
      createdAt: wf.createdAt.toISOString(),
      updatedAt: wf.updatedAt.toISOString(),
    };
    writeJson("workflows", wf.slug, data);
    wfCount++;
  }
  console.log(`  ✅ ${wfCount} workflow files`);

  // ─── 6. Certifications ─────────────────────────────
  const certs = await db.certification.findMany({ orderBy: { issueDate: "desc" } });
  for (const c of certs) {
    const data = {
      ...c,
      skills: safeParse(c.skills),
      issueDate: c.issueDate?.toISOString() ?? null,
      expiryDate: c.expiryDate?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
    writeJson("certifications", c.slug, data);
  }
  console.log(`  ✅ ${certs.length} certification files`);

  // ─── 7. Achievements ───────────────────────────────
  const achievements = await db.achievement.findMany({ orderBy: { date: "desc" } });
  for (const a of achievements) {
    const data = {
      ...a,
      date: a.date?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
    writeJson("achievements", a.slug, data);
  }
  console.log(`  ✅ ${achievements.length} achievement files`);

  // ─── 8. Blog Posts ─────────────────────────────────
  const posts = await db.blogPost.findMany({
    include: { seo: true },
    orderBy: { publishedAt: "desc" },
  });
  for (const post of posts) {
    const data = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      category: post.category,
      tags: safeParse(post.tags),
      readingTime: post.readingTime,
      published: post.published,
      featured: post.featured,
      seo: post.seo ? { title: post.seo.title, description: post.seo.description, ogImage: post.seo.ogImage } : null,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
    writeJson("blog", post.slug, data);
  }
  console.log(`  ✅ ${posts.length} blog post files`);

  // ─── 9. Categories ─────────────────────────────────
  const categories = await db.category.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
  for (const c of categories) {
    writeJson("categories", c.slug, {
      id: c.id, name: c.name, slug: c.slug,
      description: c.description, icon: c.icon, color: c.color,
      parentId: c.parentId, projectCount: c._count.projects,
    });
  }
  console.log(`  ✅ ${categories.length} category files`);

  // ─── 10. Skills ────────────────────────────────────
  const skillCats = await db.skillCategory.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  for (const sc of skillCats) {
    writeJson("skills", sc.slug, {
      id: sc.id, name: sc.name, slug: sc.slug,
      icon: sc.icon, color: sc.color,
      skills: sc.skills.map((s) => ({
        id: s.id, name: s.name, slug: s.slug,
        icon: s.icon, color: s.color, level: s.level,
      })),
    });
  }
  console.log(`  ✅ ${skillCats.length} skill category files`);

  // ─── 11. Homepage Sections ─────────────────────────
  const sections = await db.homepageSection.findMany({ orderBy: { order: "asc" } });
  for (const s of sections) {
    writeJson("homepage", s.key, {
      id: s.id, key: s.key, title: s.title, subtitle: s.subtitle,
      content: s.content ? JSON.parse(s.content) : null,
      visible: s.visible, order: s.order,
    });
  }
  console.log(`  ✅ ${sections.length} homepage section files`);

  // ─── 12. Settings ──────────────────────────────────
  const settings = await db.setting.findMany({ orderBy: { key: "asc" } });
  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;
  if (Object.keys(settingsMap).length > 0) {
    writeJson("settings", "site", settingsMap);
    console.log(`  ✅ settings/site.json`);
  }

  console.log(`\n📦 Export complete! Files written to content/ directory.`);
}

// Re-export for clarity within this script
const safeParse = parseJsonArray;

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
