"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Eye, Code } from "lucide-react";
import { MdxRenderer } from "@/components/mdx/mdx-renderer";
import { generateSlug, type ContentType, ALL_CONTENT_TYPES } from "@/lib/mdx-types";

const CONTENT_TYPE_OPTIONS = [
  { value: "labs", label: "Laboratory Manuals" },
  { value: "projects", label: "Projects" },
  { value: "client-work", label: "Client Work" },
  { value: "automation", label: "Automation Workflows" },
  { value: "courses", label: "Courses" },
  { value: "research", label: "Research" },
  { value: "certifications", label: "Certifications" },
  { value: "learning", label: "Learning Notes" },
  { value: "blog", label: "Blog Posts" },
];

const INITIAL_CONTENT = `## Overview

Brief description of this entry.

## Objective

Why this work was performed.

## Theory / Background

Important concepts and principles.

## Procedure / Implementation

Step-by-step explanation.

## Results / Output

Key findings and outcomes.

## Learning Outcomes

Skills and knowledge gained.
`;

export default function CreateMdxEntryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: "labs" as ContentType,
    title: "",
    slug: "",
    category: "",
    course: "",
    department: "",
    semester: "",
    difficulty: "",
    status: "draft" as "draft" | "published" | "archived",
    tags: "",
    technologies: "",
    software: "",
    hardware: "",
    tools: "",
    skills: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
    content: INITIAL_CONTENT,
  });

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const frontmatter = {
        title: formData.title,
        slug: formData.slug,
        type: formData.type,
        category: formData.category,
        course: formData.course,
        department: formData.department,
        semester: formData.semester,
        difficulty: formData.difficulty || undefined,
        status: formData.status,
        featured: false,
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

      const res = await fetch("/api/mdx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          frontmatter,
          content: formData.content,
        }),
      });

      if (res.ok) {
        toast.success("Entry created successfully");
        router.push("/admin/mdx");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create entry");
      }
    } catch {
      toast.error("Failed to create entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <FadeIn>
      <div className="mb-6">
        <Link
          href="/admin/mdx"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to MDX Content
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create MDX Entry</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Write your MDX content with full Markdown support.
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
                      className="min-h-[500px] font-mono text-sm leading-relaxed"
                      placeholder="Write your MDX content here..."
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="min-h-[500px] rounded-lg border border-card-border p-6 bg-card-background overflow-auto">
                      <MdxRenderer
                        content={formData.content}
                        frontmatter={{
                          title: formData.title,
                          slug: formData.slug,
                          type: formData.type,
                          category: formData.category,
                          status: formData.status,
                          featured: false,
                          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
                          technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                          software: [],
                          hardware: [],
                          tools: [],
                          skills: [],
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

          {/* Sidebar — Metadata */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, type: v as ContentType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="My Engineering Entry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="my-engineering-entry"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. Use lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, course: e.target.value }))
                    }
                    placeholder="e.g. EE-101 Electronic Engineering Drawing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, department: e.target.value }))
                    }
                    placeholder="e.g. Electronic Engineering"
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
                      placeholder="e.g. 1st"
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
                    placeholder="OrCAD, Schematic, Circuit Design"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, technologies: e.target.value }))
                    }
                    placeholder="OrCAD Capture CIS, PSpice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="software">Software (comma-separated)</Label>
                  <Input
                    id="software"
                    value={formData.software}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, software: e.target.value }))
                    }
                    placeholder="OrCAD Capture CIS 17.4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hardware">Hardware (comma-separated)</Label>
                  <Input
                    id="hardware"
                    value={formData.hardware}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hardware: e.target.value }))
                    }
                    placeholder="Arduino Uno, Oscilloscope"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tools">Tools (comma-separated)</Label>
                  <Input
                    id="tools"
                    value={formData.tools}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tools: e.target.value }))
                    }
                    placeholder="Soldering Station, Multimeter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, skills: e.target.value }))
                    }
                    placeholder="Schematic Design, Component Placement"
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
                    placeholder="Custom title for search results"
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
                    placeholder="Meta description for search results"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, keywords: e.target.value }))
                    }
                    placeholder="schematic capture, OrCAD, PCB design"
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
                    Create Entry
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/mdx">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FadeIn>
  );
}
