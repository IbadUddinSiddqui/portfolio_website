"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { createProject, updateProject } from "prisma/data-actions";
import type { Category } from "@prisma/client";

type ProjectFormData = {
  id?: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  categoryId?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  lessons?: string | null;
};

export function ProjectEditForm({
  project,
  categories,
}: {
  project: ProjectFormData | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(
    project || {
      title: "",
      description: "",
      shortDescription: "",
      technologies: [],
      githubUrl: "",
      liveUrl: "",
      categoryId: null,
      status: "DRAFT",
      featured: false,
      problem: "",
      solution: "",
      architecture: "",
      lessons: "",
    }
  );
  const [techInput, setTechInput] = useState("");

  const isEditing = !!project?.id;

  function addTech() {
    const trimmed = techInput.trim();
    if (trimmed && !formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, trimmed],
      }));
      setTechInput("");
    }
  }

  function removeTech(tech: string) {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
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
        description: rest.description,
        shortDescription: rest.shortDescription ?? undefined,
        technologies: rest.technologies,
        githubUrl: rest.githubUrl ?? undefined,
        liveUrl: rest.liveUrl ?? undefined,
        categoryId: rest.categoryId ?? undefined,
        status: rest.status,
        featured: rest.featured,
        problem: rest.problem ?? undefined,
        solution: rest.solution ?? undefined,
        architecture: rest.architecture ?? undefined,
        lessons: rest.lessons ?? undefined,
      };

      if (isEditing) {
        await updateProject(project!.id!, input);
        toast.success("Project updated");
      } else {
        await createProject(input);
        toast.success("Project created");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error(isEditing ? "Failed to update project" : "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="My Awesome Project"
          required
        />
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <ImageUpload
          currentImage={formData.thumbnail}
          onUploadComplete={(url) => update("thumbnail", url)}
          onRemove={() => update("thumbnail", null)}
          label="Thumbnail Image"
        />
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          id="shortDescription"
          value={formData.shortDescription || ""}
          onChange={(e) => update("shortDescription", e.target.value)}
          placeholder="A brief tagline for cards"
        />
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the project in detail..."
          rows={5}
          required
        />
      </div>

      {/* Category & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={formData.categoryId || ""}
            onValueChange={(value) =>
              update("categoryId", value === "none" ? null : value)
            }
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>                <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => update("status", value as "DRAFT" | "PUBLISHED" | "ARCHIVED")}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl || ""}
            onChange={(e) => update("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            value={formData.liveUrl || ""}
            onChange={(e) => update("liveUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Next.js"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTech}>
            Add
          </Button>
        </div>
        {formData.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-secondary text-xs font-medium"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="text-muted-foreground hover:text-foreground ml-0.5"
                  aria-label={`Remove ${tech}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => update("featured", checked)}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured project (shown on homepage)
        </Label>
      </div>

      {/* Case Study Sections */}
      <div className="space-y-2">
        <Label htmlFor="problem">Problem</Label>
        <Textarea
          id="problem"
          value={formData.problem || ""}
          onChange={(e) => update("problem", e.target.value)}
          placeholder="What problem did this project solve?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Solution</Label>
        <Textarea
          id="solution"
          value={formData.solution || ""}
          onChange={(e) => update("solution", e.target.value)}
          placeholder="How did you approach the solution?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="architecture">Architecture</Label>
        <Textarea
          id="architecture"
          value={formData.architecture || ""}
          onChange={(e) => update("architecture", e.target.value)}
          placeholder="Describe the technical architecture..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessons">Lessons Learned</Label>
        <Textarea
          id="lessons"
          value={formData.lessons || ""}
          onChange={(e) => update("lessons", e.target.value)}
          placeholder="What did you learn from this project?"
          rows={3}
        />
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
              : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
