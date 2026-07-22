"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { createBlogPost, updateBlogPost } from "prisma/data-actions";

type BlogPostData = {
  id?: string;
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags: string[];
  published: boolean;
};

export function BlogEditForm({
  post,
}: {
  post: BlogPostData | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogPostData>(
    post || {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      tags: [],
      published: false,
    }
  );
  const [tagInput, setTagInput] = useState("");

  const isEditing = !!post?.id;

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { id: _id, ...rest } = formData;
      // Build a clean object converting null to undefined for server action compatibility
      const input = {
        title: rest.title,
        content: rest.content,
        excerpt: rest.excerpt ?? undefined,
        coverImage: rest.coverImage ?? undefined,
        tags: rest.tags,
        published: rest.published,
      };

      if (isEditing) {
        await updateBlogPost(post!.id!, input);
        toast.success("Post updated");
      } else {
        await createBlogPost(input);
        toast.success("Post created");
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error(isEditing ? "Failed to update post" : "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="My Awesome Blog Post"
          required
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={formData.excerpt || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          placeholder="A brief summary for cards and SEO"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <ImageUpload
          currentImage={formData.coverImage}
          onUploadComplete={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
          onRemove={() => setFormData((prev) => ({ ...prev, coverImage: null }))}
          label="Cover Image"
        />
        <Input
          id="coverImage"
          value={formData.coverImage || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
          }
          placeholder="Or paste an image URL directly"
          className="mt-2"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Write your blog post content in Markdown..."
          rows={15}
          required
          className="font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="TypeScript"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-secondary text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground ml-0.5"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, published: checked }))
          }
        />
        <Label htmlFor="published" className="cursor-pointer">
          Published (visible to visitors)
        </Label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
