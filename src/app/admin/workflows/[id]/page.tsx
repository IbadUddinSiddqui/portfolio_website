import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { WorkflowEditForm } from "./workflow-edit-form";

export const dynamic = "force-dynamic";

async function getWorkflow(id: string) {
  if (id === "new") return null;
  const w = await db.workflow.findUnique({ where: { id } });
  if (!w) notFound();
  return w;
}

export default async function AdminWorkflowEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = await getWorkflow(id);
  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{id === "new" ? "New Workflow" : "Edit Workflow"}</h1>
          <p className="text-sm text-muted-foreground">{id === "new" ? "Create a new automation workflow." : `Editing "${workflow?.title}"`}</p>
        </div>
        <Button variant="outline" asChild><Link href="/admin/workflows">Back</Link></Button>
      </div>
      <div className="max-w-3xl"><WorkflowEditForm workflow={workflow} /></div>
    </FadeIn>
  );
}
