import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { parseJsonArray } from "@/lib/utils";
import { BlogEditForm } from "./blog-edit-form";

export const dynamic = "force-dynamic";

async function getPost(id: string) {
  if (id === "new") return null;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return post;
}

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  const isNew = id === "new";

  // Parse tags from JSON string to array for the form
  const formPost = post
    ? {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        tags: parseJsonArray(post.tags),
        published: post.published,
      }
    : null;

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {isNew ? "New Post" : "Edit Post"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew
              ? "Write a new blog post."
              : `Editing "${formPost?.title}"`}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/blog">Back to Blog</Link>
        </Button>
      </div>

      <BlogEditForm post={formPost} />
    </FadeIn>
  );
}
