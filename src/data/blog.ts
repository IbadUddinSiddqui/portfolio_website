import { db } from "@/lib/db";
import { cache } from "react";
import { parseJsonArray } from "@/lib/utils";

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  category: string | null;
  readingTime: number | null;
  featured: boolean;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  updatedAt: Date;
  seo: { title?: string | null; description?: string | null; ogImage?: string | null } | null;
}

const POSTS_PER_PAGE = 9;

export const getPublishedPosts = cache(
  async (page = 1, tagSlug?: string): Promise<{ posts: BlogPostListItem[]; total: number; totalPages: number }> => {
    const where: Record<string, unknown> = { published: true };
    if (tagSlug) where.tags = { contains: tagSlug };

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      db.blogPost.count({ where }),
    ]);

    return {
      posts: posts.map(formatBlogListItem),
      total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
    };
  }
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPostDetail | null> => {
  const post = await db.blogPost.findFirst({
    where: { slug, published: true },
    include: { seo: { select: { title: true, description: true, ogImage: true } } },
  });
  if (!post) return null;
  return formatBlogDetail(post);
});

export const getLatestPosts = cache(async (limit = 10): Promise<BlogPostListItem[]> => {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(formatBlogListItem);
});

export const getBlogTags = cache(async (): Promise<string[]> => {
  const posts = await db.blogPost.findMany({ where: { published: true }, select: { tags: true } });
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of parseJsonArray<string>(post.tags)) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
});

export const getPublishedPostCount = cache(async (): Promise<number> => {
  return db.blogPost.count({ where: { published: true } });
});

export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  const posts = await db.blogPost.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map((p) => p.slug);
});

function formatBlogListItem(post: any): BlogPostListItem {
  return {
    id: post.id, title: post.title, slug: post.slug,
    excerpt: post.excerpt, coverImage: post.coverImage,
    tags: parseJsonArray<string>(post.tags),
    published: post.published,
    publishedAt: post.publishedAt, createdAt: post.createdAt,
    category: post.category, readingTime: post.readingTime,
    featured: post.featured,
  };
}

function formatBlogDetail(post: any): BlogPostDetail {
  return {
    ...formatBlogListItem(post),
    content: post.content,
    updatedAt: post.updatedAt,
    seo: post.seo,
  };
}
