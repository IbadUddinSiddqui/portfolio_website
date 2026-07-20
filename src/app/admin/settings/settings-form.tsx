"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSetting } from "prisma/data-actions";

const SETTINGS_FIELDS = [
  { key: "site_title", label: "Site Title", type: "text" as const },
  { key: "site_description", label: "Site Description", type: "textarea" as const },
  { key: "author_name", label: "Author Name", type: "text" as const },
  { key: "author_email", label: "Author Email", type: "text" as const },
  { key: "social_github", label: "GitHub URL", type: "text" as const },
  { key: "social_twitter", label: "Twitter/X URL", type: "text" as const },
  { key: "social_linkedin", label: "LinkedIn URL", type: "text" as const },
];

export function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(initial);

  async function handleSave(key: string, value: string) {
    try {
      await saveSetting(key, value);
    } catch {
      toast.error(`Failed to save ${key}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await Promise.all(
        SETTINGS_FIELDS.map((field) => saveSetting(field.key, values[field.key] || ""))
      );
      toast.success("Settings saved");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {SETTINGS_FIELDS.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.key}
              value={values[field.key] || ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              onBlur={() => handleSave(field.key, values[field.key] || "")}
              rows={3}
            />
          ) : (
            <Input
              id={field.key}
              value={values[field.key] || ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              onBlur={() => handleSave(field.key, values[field.key] || "")}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          )}
        </div>
      ))}

      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? "Saving..." : "Save All Settings"}
      </Button>
    </form>
  );
}
