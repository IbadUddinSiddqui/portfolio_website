"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, ExternalLink, Copy, Search, Upload } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleDelete = async (id: string) => {
    try {
      const { deleteMedia } = await import("prisma/data-actions");
      await deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const filtered = media.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.alt?.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Media</h1>
          <p className="text-sm text-muted-foreground">
            {media.length} file{media.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Upload area */}
      {showUpload && (          <div className="mb-8 rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Upload New Image</h2>
          <div className="max-w-md">
            <ImageUpload
              onUploadComplete={(url) => {
                // Save to media library
                fetch(`/api/media`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url, filename: url.split("/").pop() || "image", type: "image" }),
                }).then(() => {
                  fetchMedia();
                  toast.success("Added to media library");
                });
              }}
              label=""
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="pl-9"
        />
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface/60 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            {search ? "No matching files" : "No media yet"}
          </p>
          {!search && (
            <Button variant="outline" size="sm" onClick={() => setShowUpload(true)}>
              Upload your first image
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-card-border/50 bg-card-background aspect-square cursor-pointer"
              onClick={() => setSelected(item)}
            >
              {item.type.startsWith("image/") ? (
                <Image
                  src={item.url}
                  alt={item.alt || item.filename}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface/30">
                  <span className="text-2xl">📄</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.url); }}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="p-2 rounded-lg bg-red-500/60 backdrop-blur-sm text-white hover:bg-red-500/80 transition-all"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">{selected.alt || selected.filename}</DialogTitle>
                <DialogDescription>Media details</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-surface/30 relative">
                  {selected.type?.startsWith("image/") ? (
                    <Image src={selected.url} alt={selected.alt || ""} fill className="object-contain" sizes="400px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Filename</p>
                    <p className="text-sm font-medium truncate">{selected.filename}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Size</p>
                    <p className="text-sm">{formatSize(selected.size)}</p>
                  </div>
                  {selected.width && selected.height && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                      <p className="text-sm">{selected.width} × {selected.height}px</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">URL</p>
                    <code className="text-xs bg-surface-secondary px-2 py-1 rounded block truncate">{selected.url}</code>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopyUrl(selected.url)}>
                      <Copy className="mr-1 h-3 w-3" /> Copy URL
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={selected.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" /> Open
                      </a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { handleDelete(selected.id); setSelected(null); }}>
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
}
