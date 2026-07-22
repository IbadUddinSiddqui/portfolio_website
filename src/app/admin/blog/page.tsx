import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TogglePublishButton } from "./toggle-publish-button";

export const dynamic = "force-dynamic";

async function getBlogPosts() {
  return db.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">New Post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            No blog posts yet.
          </p>
          <Button asChild>
            <Link href="/admin/blog/new">Write First Post</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Title
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                  Published
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
                  Created
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr
                  key={post.id}
                  className={`border-b border-border last:border-0 hover:bg-surface-secondary/30 transition-colors ${
                    index % 2 === 0 ? "bg-surface" : "bg-surface/5"
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.published ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 font-medium"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800 font-medium"
                      >
                        Draft
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <TogglePublishButton
                      postId={post.id}
                      published={post.published}
                    />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            View
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FadeIn>
  );
}
