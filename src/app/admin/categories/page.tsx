import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory } from "prisma/data-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Categories</h1>
        <p className="text-sm text-muted-foreground">Manage project categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Create Category</h2>
          <form action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string;
            if (name?.trim()) {
              await createCategory(name.trim());
              revalidatePath("/admin/categories");
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g., AI & Machine Learning" required />
            </div>
            <Button type="submit" className="w-full">Create</Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">All Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {cat.icon && <span className="text-lg">{cat.icon}</span>}
                    <div>
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({cat._count.projects} projects)</span>
                    </div>
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteCategory(cat.id);
                    revalidatePath("/admin/categories");
                  }}>
                    <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive text-xs">Delete</Button>
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
