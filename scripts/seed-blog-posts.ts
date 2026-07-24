/**
 * Seed Blog Posts Only
 *
 * Run: DATABASE_URL="..." npx tsx scripts/seed-blog-posts.ts
 *
 * Seeds the 2 blog posts that were missed when the main seed timed out.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { slugify } from "../src/lib/utils";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const blogPosts = [
  {
    title: "Building a Premium Portfolio with Next.js",
    slug: slugify("Building a Premium Portfolio with Next.js"),
    excerpt:
      "A deep dive into architecting a modern portfolio platform with CMS, animations, and performance optimization.",
    content: [
      "# Building a Premium Portfolio with Next.js",
      "",
      "## Why Build Your Own Portfolio CMS?",
      "",
      "In this post, I'll walk through the architecture decisions behind building a portfolio platform.",
      "",
      "## Architecture Overview",
      "",
      "The portfolio is built with Next.js 16, using the App Router for routing, Server Components for data fetching, and a Prisma ORM backed by PostgreSQL for the database layer.",
      "",
      "## Key Features",
      "- Full CMS with admin dashboard",
      "- Dynamic project showcase",
      "- Blog engine with markdown support",
      "- Contact form with message management",
      "- Performance optimized with 100 Lighthouse scores",
      "",
      "## Performance Considerations",
      "Every component was designed with performance in mind - GPU-accelerated animations, lazy loading, dynamic imports, and streaming with Suspense boundaries.",
    ].join("\n"),
    tags: JSON.stringify(["nextjs", "react", "typescript", "performance"]),
    category: "Development",
  },
  {
    title: "Getting Started with Prisma and PostgreSQL",
    slug: slugify("Getting Started with Prisma and PostgreSQL"),
    excerpt:
      "A practical guide to setting up Prisma ORM with PostgreSQL for full-stack development.",
    content: [
      "# Getting Started with Prisma and PostgreSQL",
      "",
      "Prisma is a modern ORM that makes database access simple and type-safe. Combined with PostgreSQL, it's perfect for production applications.",
      "",
      "## Setup",
      "",
      "First, install the dependencies:",
      "",
      "```bash",
      "npm install @prisma/client @prisma/adapter-pg pg",
      "npm install -D prisma @types/pg",
      "```",
      "",
      "## Schema Design",
      "Design your schema in Prisma's declarative format.",
      "The portfolio uses over 20 models including projects, skills, labs, workflows, and more.",
      "",
      "## CRUD Operations",
      "Prisma provides type-safe queries with full autocompletion, making it easy to create, read, update, and delete records.",
    ].join("\n"),
    tags: JSON.stringify(["prisma", "postgresql", "typescript", "database"]),
    category: "Development",
  },
];

async function main() {
  console.log("📝 Seeding blog posts...\n");

  for (const post of blogPosts) {
    const existing = await db.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (existing) {
      console.log(`  ⏭️  Skipped: "${post.title}" (already exists)`);
      continue;
    }

    await db.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        category: post.category,
        published: true,
        featured: true,
        publishedAt: new Date(),
      },
    });

    console.log(`  ✅ Created: "${post.title}"`);
  }

  console.log(`\n✨ Done! Blog posts seeded successfully.`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  db.$disconnect();
  process.exit(1);
});
