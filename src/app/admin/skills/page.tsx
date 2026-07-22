import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSkillCategory, createSkill } from "prisma/data-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getSkillData() {
  const categories = await db.skillCategory.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return categories;
}

export default async function AdminSkillsPage() {
  const skillCats = await getSkillData();

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Skills</h1>
        <p className="text-sm text-muted-foreground">Manage skill categories and skills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category */}
        <div className="rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Add Skill Category</h2>
          <form action={async (fd: FormData) => {
            "use server";
            const name = fd.get("name") as string;
            if (name?.trim()) {
              await createSkillCategory(name.trim());
              revalidatePath("/admin/skills");
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Category Name</Label>
              <Input id="catName" name="name" placeholder="e.g., Frontend" required />
            </div>
            <Button type="submit" className="w-full">Add Category</Button>
          </form>
        </div>

        {/* Add Skill */}
        <div className="rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Add Skill</h2>
          <form action={async (fd: FormData) => {
            "use server";
            const name = fd.get("name") as string;
            const categoryId = fd.get("categoryId") as string;
            const level = parseInt(fd.get("level") as string) || 50;
            if (name?.trim()) {
              await createSkill({ name: name.trim(), level, categoryId: categoryId || undefined });
              revalidatePath("/admin/skills");
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input id="skillName" name="name" placeholder="e.g., React" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillCategory">Category</Label>
              <select id="skillCategory" name="categoryId" defaultValue="" className="w-full h-10 px-3 rounded-lg border border-input-border bg-input-background text-sm">
                <option value="">None</option>
                {skillCats.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Level (1-100)</Label>
              <Input id="skillLevel" name="level" type="number" min={1} max={100} defaultValue={70} />
            </div>
            <Button type="submit" className="w-full">Add Skill</Button>
          </form>
        </div>

        {/* Skill List */}
        <div className="lg:col-span-3 rounded-xl border border-card-border bg-card-background p-6">
          <h2 className="text-sm font-semibold mb-4">Current Skills</h2>
          {skillCats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skill categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCats.map(cat => (
                <div key={cat.id}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                    <span className="text-xs text-muted-foreground font-normal">({cat.skills.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {cat.skills.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-secondary/30">
                        <span className="text-sm">{skill.name}</span>
                        {skill.level && (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-surface-secondary">
                              <div className="h-full rounded-full bg-accent-engineering" style={{ width: `${skill.level}%` }} />
                            </div>
                            <span className="text-xxs text-muted-foreground">{skill.level}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
