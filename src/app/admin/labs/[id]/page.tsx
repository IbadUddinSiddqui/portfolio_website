import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { LabEditForm } from "./lab-edit-form";

export const dynamic = "force-dynamic";

async function getLab(id: string) {
  if (id === "new") return null;
  const lab = await db.lab.findUnique({ where: { id } });
  if (!lab) notFound();
  return lab;
}

export default async function AdminLabEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lab = await getLab(id);
  const isNew = id === "new";

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{isNew ? "New Lab" : "Edit Lab"}</h1>
          <p className="text-sm text-muted-foreground">
            {isNew ? "Create a new lab experiment entry." : `Editing "${lab?.title}"`}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/labs">Back to Labs</Link>
        </Button>
      </div>
      <div className="max-w-3xl">
        <LabEditForm lab={lab} />
      </div>
    </FadeIn>
  );
}
