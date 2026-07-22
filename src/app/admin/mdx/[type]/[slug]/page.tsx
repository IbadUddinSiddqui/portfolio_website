"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Code,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { MdxRenderer } from "@/components/mdx/mdx-renderer";
import type { ContentType } from "@/lib/mdx-types";

export default function EditMdxEntryPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    course: "",
    courseCode: "",
    department: "",
    semester: "",
    year: "",
    difficulty: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    tags: "",
    technologies: "",
    software: "",
    hardware: "",
    tools: "",
    skills: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
    content: "",
  });

  useEffect(() => {
    fetchEntry();
  }, [type, slug]);

  async function fetchEntry() {
    try {
      setLoading(true);
      const res = await fetch(`/api/mdx/${type}/${slug}`);
      if (!res.ok) {
        toast.error("Entry not found");
        router.push("/admin/mdx");
        return;
      }
      const data = await res.json();
      const fm = data.entry.frontmatter;

      setFormData({
        title: fm.title || "",
        slug: fm.slug || slug,
        category: fm.category || "",
        course: fm.course || "",
        courseCode: fm.courseCode || "",
        department: fm.department || "",
        semester: fm.semester || "",
        year: fm.year || "",
        difficulty: fm.difficulty || "",
        status: fm.status || "draft",
        featured: fm.featured || false,
        tags: (fm.tags || []).join(", "),
        technologies: (fm.technologies || []).join(", "),
        software: (fm.software || []).join(", "),
        hardware: (fm.hardware || []).join(", "),
        tools: (fm.tools || []).join(", "),
        skills: (fm.skills || []).join(", "),
        seoTitle: fm.seoTitle || "",
        seoDescription: fm.seoDescription || "",
        keywords: (fm.keywords || []).join(", "),
        content: data.entry.content || "",
      });
    } catch {
      toast.error("Failed to load entry");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setValidation(null);

    try {
      const frontmatter = {
        title: formData.title,
        slug: formData.slug,
        type,
        category: formData.category,
        course: formData.course,
        courseCode: formData.courseCode || undefined,
        department: formData.department,
        semester: formData.semester || undefined,
        year: formData.year || undefined,
        difficulty: formData.difficulty || undefined,
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        software: formData.software
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hardware: formData.hardware
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        tools: formData.tools
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/mdx/${type}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content: formData.content }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Entry saved successfully");
        if (data.warnings?.length > 0) {
          setValidation({
            valid: true,
            errors: [],
            warnings: data.warnings,
          });
        }
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
        if (err.details) {
          setValidation(err.details);
        }
      }
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this entry? This cannot be undone."))
      return;

    try {
      const res = await fetch(`/api/mdx/${type}/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted");
        router.push("/admin/mdx");
      } else {
        toast.error("Failed to delete entry");
      }
    } catch {
      toast.error("Failed to delete entry");
    }
  }

  async function handleDuplicate() {
    const newSlug = `${slug}-copy-${Date.now()}`;
    try {
      const res = await fetch(`/api/mdx/${type}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", newSlug }),
      });
      if (res.ok) {
        toast.success("Entry duplicated");
        router.push(`/admin/mdx/${type}/${newSlug}`);
      } else {
        toast.error("Failed to duplicate");
      }
    } catch {
      toast.error("Failed to duplicate");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FadeIn>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/mdx"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to MDX Content
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Edit: {formData.title || slug}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-secondary text-xs font-mono">
                {type}/{slug}.mdx
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Alerts */}
      {validation && (
        <div className="mb-6 space-y-2">
          {validation.warnings?.map((w, i) => (
            <div
              key={`warn-${i}`}
              className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm"
            >
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
          {validation.errors?.map((e, i) => (
            <div
              key={`err-${i}`}
              className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm"
            >
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Edit your MDX content with live preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="write">
                  <TabsList className="mb-4">
                    <TabsTrigger value="write">
                      <Code className="h-4 w-4 mr-1.5" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-1.5" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write">
                    <Textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      className="min-h-[600px] font-mono text-sm leading-relaxed"
                      placeholder="Write your MDX content here..."
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="min-h-[600px] rounded-lg border border-card-border p-6 bg-card-background overflow-auto">
                      <MdxRenderer
                        content={formData.content}
                        frontmatter={{
                          title: formData.title,
                          slug: formData.slug,
                          type,
                          category: formData.category,
                          status: formData.status,
                          featured: formData.featured,
                          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                          technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                          course: formData.course,
                          department: formData.department,
                          semester: formData.semester,
                          difficulty: formData.difficulty,
                          software: formData.software.split(",").map((s) => s.trim()).filter(Boolean),
                          hardware: formData.hardware.split(",").map((h) => h.trim()).filter(Boolean),
                          tools: formData.tools.split(",").map((t) => t.trim()).filter(Boolean),
                          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: v as "draft" | "published" | "archived",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          Draft
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          Published
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          Archived
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="rounded border-border"
                  />
                  <Label htmlFor="featured" className="text-sm cursor-pointer">
                    Featured entry
                  </Label>
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="e.g. Electronic Engineering"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, course: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input
                      id="courseCode"
                      value={formData.courseCode}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, courseCode: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, department: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, semester: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, difficulty: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, technologies: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="software">Software</Label>
                  <Input
                    id="software"
                    value={formData.software}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, software: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hardware">Hardware</Label>
                  <Input
                    id="hardware"
                    value={formData.hardware}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hardware: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tools">Tools</Label>
                  <Input
                    id="tools"
                    value={formData.tools}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tools: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, skills: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))
                    }
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, keywords: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FadeIn>
  );
}
