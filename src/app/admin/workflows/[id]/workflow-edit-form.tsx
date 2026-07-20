"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createWorkflow, updateWorkflow } from "prisma/data-actions";

type WorkflowData = { id?: string; title: string; summary?: string | null; description?: string | null; category?: string | null; trigger?: string | null; purpose?: string | null; difficulty?: string | null; status: string; };

export function WorkflowEditForm({ workflow }: { workflow: WorkflowData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<WorkflowData>(workflow || { title: "", summary: "", description: "", category: null, trigger: "", purpose: "", difficulty: null, status: "DRAFT" });
  const isEditing = !!workflow?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) { await updateWorkflow(workflow!.id!, form as any); toast.success("Workflow updated"); }
      else { await createWorkflow(form as any); toast.success("Workflow created"); }
      router.push("/admin/workflows"); router.refresh();
    } catch { toast.error(isEditing ? "Failed to update" : "Failed to create"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label>Summary</Label>
        <Input value={form.summary || ""} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category || ""} onValueChange={v => setForm(p => ({ ...p, category: v || null }))}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["github","portfolio","linkedin","leads","pdf","crm","email","resume"].map(c => (
                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={form.difficulty || ""} onValueChange={v => setForm(p => ({ ...p, difficulty: v || null }))}>
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
      <div className="space-y-2">
        <Label>Trigger</Label>
        <Input value={form.trigger || ""} onChange={e => setForm(p => ({ ...p, trigger: e.target.value }))} placeholder="What triggers this workflow?" />
      </div>
      <div className="space-y-2">
        <Label>Purpose</Label>
        <Textarea value={form.purpose || ""} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Save Changes" : "Create Workflow"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/workflows")}>Cancel</Button>
      </div>
    </form>
  );
}
