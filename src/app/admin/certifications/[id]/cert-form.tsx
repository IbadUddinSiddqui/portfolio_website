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
import { createCertification, updateCertification } from "prisma/data-actions";

export function CertForm({ cert }: { cert: { id: string; title: string; issuer: string; description?: string | null; credentialUrl?: string | null; image?: string | null; featured: boolean; } | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: cert?.title || "", issuer: cert?.issuer || "", description: cert?.description || "", credentialUrl: cert?.credentialUrl || "", image: cert?.image || "", featured: cert?.featured || false });
  const isEditing = !!cert?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      if (isEditing) { await updateCertification(cert!.id, form); toast.success("Updated"); }
      else { await createCertification(form); toast.success("Created"); }
      router.push("/admin/certifications"); router.refresh();
    } catch { toast.error(isEditing ? "Failed to update" : "Failed to create"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
      <div className="space-y-2"><Label>Issuer</Label><Input value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} required /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
      <div className="space-y-2"><Label>Credential URL</Label><Input value={form.credentialUrl} onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://" /></div>
      <div className="space-y-2">
        <ImageUpload
          currentImage={form.image}
          onUploadComplete={(url) => setForm(p => ({ ...p, image: url }))}
          onRemove={() => setForm(p => ({ ...p, image: "" }))}
          label="Certificate Image"
        />
        <Input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="Or paste image URL" className="mt-2" />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="featured" checked={form.featured} onCheckedChange={v => setForm(p => ({ ...p, featured: v }))} />
        <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Save Changes" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/certifications")}>Cancel</Button>
      </div>
    </form>
  );
}
