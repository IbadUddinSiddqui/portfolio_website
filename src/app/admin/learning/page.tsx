import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCurrentLearning } from "prisma/data-actions";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getLearning() {
  return db.currentLearning.findMany({ orderBy: { order: "asc" } });
}

export default async function AdminLearningPage() {
  const learning = await getLearning();

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Current Learning</h1>
        <p className="text-sm text-muted-foreground">Technologies you&apos;re currently studying.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add form */}
        <div className="rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Add Technology</h2>
          <form action={async (fd: FormData) => {
            "use server";
            const technology = fd.get("technology") as string;
            const description = fd.get("description") as string;
            const progress = parseInt(fd.get("progress") as string) || 0;
            const status = (fd.get("status") as string) || "LEARNING";
            if (technology?.trim()) {
              await createCurrentLearning({ technology: technology.trim(), description: description || undefined, progress, status });
              revalidatePath("/admin/learning");
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tech">Technology</Label>
              <Input id="tech" name="technology" placeholder="e.g., Rust" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" name="description" placeholder="What are you learning?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (0-100)</Label>
              <Input id="progress" name="progress" type="number" min={0} max={100} defaultValue={30} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" defaultValue="LEARNING" className="w-full h-10 px-3 rounded-lg border border-input-border bg-input-background text-sm">
                <option value="PLANNING">Planning</option>
                <option value="LEARNING">Learning</option>
                <option value="PRACTICING">Practicing</option>
                <option value="MASTERED">Mastered</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Add</Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Currently Learning ({learning.length})</h2>
          {learning.length === 0 ? (
            <p className="text-sm text-muted-foreground">No learning entries yet. Add technologies you're studying.</p>
          ) : (
            <div className="space-y-3">
              {learning.map(item => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-secondary/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{item.technology}</span>
                      <StatusPill status={item.status} />
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                    {item.progress != null && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 h-1.5 rounded-full bg-surface-secondary">
                          <div className="h-full rounded-full bg-accent-engineering" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-xxs text-muted-foreground">{item.progress}%</span>
                      </div>
                    )}
                  </div>
                  <form action={async () => {
                    "use server";
                    const { db } = await import("@/lib/db");
                    await db.currentLearning.delete({ where: { id: item.id } });
                    revalidatePath("/admin/learning");
                  }}>
                    <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PLANNING: "bg-blue-500/10 text-blue-500",
    LEARNING: "bg-amber-500/10 text-amber-500",
    PRACTICING: "bg-green-500/10 text-green-500",
    MASTERED: "bg-violet-500/10 text-violet-500",
  };
  return (
    <span className={`text-xxs px-2 py-0.5 rounded-full font-medium ${colors[status] || colors.LEARNING}`}>
      {status}
    </span>
  );
}
