"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createLab, updateLab } from "prisma/data-actions";

const LAB_CATEGORIES = ["electronics", "programming", "drawing", "matlab", "labview", "multisim", "orcad"];

type LabData = {
  id?: string; title: string; summary?: string | null; description?: string | null;
  category?: string | null; course?: string | null; semester?: string | null;
  year?: number | null; difficulty?: string | null; status: string;
  featured: boolean;
};

export function LabEditForm({ lab }: { lab: LabData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LabData>(lab || {
    title: "", summary: "", description: "", category: null,
    course: "", semester: "", year: null, difficulty: null,
    status: "DRAFT", featured: false,
  });

  const isEditing = !!lab?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateLab(lab!.id!, form as any);
        toast.success("Lab updated");
      } else {
        await createLab(form as any);
        toast.success("Lab created");
      }
      router.push("/admin/labs");
      router.refresh();
    } catch {
      toast.error(isEditing ? "Failed to update lab" : "Failed to create lab");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof LabData>(key: K, value: LabData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={form.title} onChange={e => update("title", e.target.value)} placeholder="Lab experiment title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input id="summary" value={form.summary || ""} onChange={e => update("summary", e.target.value)} placeholder="Brief description" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description || ""} onChange={e => update("description", e.target.value)} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={form.category || ""} onValueChange={v => update("category", v || null)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {LAB_CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={form.difficulty || ""} onValueChange={v => update("difficulty", v || null)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={v => update("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-3 pb-2">
          <Switch id="featured" checked={form.featured} onCheckedChange={v => update("featured", v)} />
          <Label htmlFor="featured" className="cursor-pointer">Featured lab</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Save Changes" : "Create Lab"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/labs")} disabled={loading}>Cancel</Button>
      </div>
    </form>
  );
}
