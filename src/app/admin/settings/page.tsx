import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

async function getSettings() {
  const settings = await db.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your site settings and configuration.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </FadeIn>
  );
}
