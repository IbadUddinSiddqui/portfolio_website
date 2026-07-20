"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string | null;
  className?: string;
  label?: string;
}

/**
 * ImageUpload
 *
 * Drag-and-drop image uploader with:
 * - Drag zone with visual feedback
 * - File type/size validation before upload
 * - Upload progress indicator
 * - Preview of uploaded image
 * - Remove button to clear
 * - Re-upload support (replaces existing)
 */
export function ImageUpload({
  onUploadComplete,
  onRemove,
  currentImage,
  className,
  label = "Upload Image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      toast.error("Only images (JPEG, PNG, WebP, GIF, SVG) are allowed");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large — max 5MB");
      return false;
    }
    return true;
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setPreview(data.file.url);
      setSuccess(true);
      toast.success("Image uploaded successfully");
      onUploadComplete?.(data.file.url);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted/30 group">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-lg bg-red-500/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-red-500/80"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative w-full aspect-video rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2",
            dragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border/50 hover:border-primary/40 hover:bg-muted/30 bg-muted/10"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                dragging ? "bg-primary/20 scale-110" : "bg-muted/60"
              )}>
                <Upload className={cn("h-5 w-5 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Drop image here or click to browse
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  PNG, JPG, WebP — max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleChange}
        className="hidden"
        aria-label="Choose image file"
      />
    </div>
  );
}
