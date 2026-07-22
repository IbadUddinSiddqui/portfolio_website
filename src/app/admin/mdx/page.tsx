"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Plus,
  Search,
  FileText,
  Layers,
  Loader2,
  Eye,
  Trash2,
  Copy,
  Edit,
  AlertCircle,
} from "lucide-react";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  labs: "Labs",
  projects: "Projects",
  "client-work": "Client Work",
  automation: "Automation",
  courses: "Courses",
  research: "Research",
  certifications: "Certifications",
  learning: "Learning",
  blog: "Blog",
};

const TYPE_COLORS: Record<string, string> = {
  labs: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  projects: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800",
  "client-work": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  automation: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  courses: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800",
  research: "bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:border-cyan-800",
  certifications: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  learning: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
  blog: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800",
};

interface MdxEntryData {
  frontmatter: {
    title: string;
    slug: string;
    type: string;
    status: string;
    category: string;
    tags: string[];
    technologies: string[];
    updatedAt: string;
    createdAt: string;
    course?: string;
    department?: string;
  };
  content: string;
  type: string;
  slug: string;
}

export default function AdminMdxPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<MdxEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/mdx?${params.toString()}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Failed to fetch MDX entries:", err);
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, [typeFilter, statusFilter]);

  function handleSearch() {
    fetchEntries();
  }

  async function handleDelete(type: string, slug: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/mdx/${type}/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted");
        fetchEntries();
      } else {
        toast.error("Failed to delete entry");
      }
    } catch {
      toast.error("Failed to delete entry");
    }
  }

  async function handleDuplicate(type: string, slug: string) {
    try {
      const res = await fetch(`/api/mdx/${type}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", newSlug: `${slug}-copy-${Date.now()}` }),
      });
      if (res.ok) {
        toast.success("Entry duplicated");
        fetchEntries();
      } else {
        toast.error("Failed to duplicate entry");
      }
    } catch {
      toast.error("Failed to duplicate entry");
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "published":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 font-medium"
          >
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800 font-medium"
          >
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="outline"
            className="text-xs bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800 font-medium"
          >
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  }

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">MDX Content</h1>
          <p className="text-sm text-muted-foreground">
            Manage engineering content stored as MDX files.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/mdx/new">
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(CONTENT_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-16 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm mb-4">
            No MDX entries found.
          </p>
          <Button asChild>
            <Link href="/admin/mdx/new">Create First Entry</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <div className="divide-y divide-border">
            {entries.map((entry, i) => (
              <div
                key={`${entry.type}-${entry.slug}`}
                className={`flex items-start gap-4 p-4 hover:bg-surface-secondary/30 transition-colors ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface/5"
                }`}
              >
                {/* Type Badge */}
                <span
                  className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium border ${
                    TYPE_COLORS[entry.type] || "bg-gray-500/10 text-gray-600"
                  }`}
                >
                  {CONTENT_TYPE_LABELS[entry.type] || entry.type}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Link
                      href={`/admin/mdx/${entry.type}/${entry.slug}`}
                      className="text-sm font-medium hover:text-primary transition-colors truncate"
                    >
                      {entry.frontmatter.title}
                    </Link>
                    <span className="shrink-0">
                      {getStatusBadge(entry.frontmatter.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {entry.frontmatter.category && (
                      <span className="text-xs text-muted-foreground">
                        {entry.frontmatter.category}
                      </span>
                    )}
                    {entry.frontmatter.tags?.length > 0 && (
                      <span className="text-xs text-muted-foreground/60">
                        {entry.frontmatter.tags.slice(0, 3).join(", ")}
                        {entry.frontmatter.tags.length > 3 && "..."}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/40">
                      Updated {new Date(entry.frontmatter.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/mdx/${entry.type}/${entry.slug}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(entry.type, entry.slug)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(entry.type, entry.slug)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FadeIn>
  );
}
