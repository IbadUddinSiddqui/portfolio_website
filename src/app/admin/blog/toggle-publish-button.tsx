"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateBlogPostPublish } from "prisma/data-actions";

export function TogglePublishButton({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(published);

  async function handleToggle() {
    setLoading(true);
    const newState = !checked;
    try {
      await updateBlogPostPublish(postId, newState);
      setChecked(newState);
      toast.success(newState ? "Post published" : "Post unpublished");
      router.refresh();
    } catch {
      toast.error("Failed to update publish status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={`publish-${postId}`}
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <Label
        htmlFor={`publish-${postId}`}
        className="text-xs text-muted-foreground cursor-pointer"
      >
        {checked ? "Live" : "Draft"}
      </Label>
    </div>
  );
}
