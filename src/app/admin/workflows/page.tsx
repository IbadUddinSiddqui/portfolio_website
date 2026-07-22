import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

export default async function AdminWorkflowsPage() {
  const workflows = await db.workflow.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Workflows</h1>
          <p className="text-sm text-muted-foreground">Automation workflow definitions.</p>
        </div>
        <Button asChild><Link href="/admin/workflows/new">New Workflow</Link></Button>
      </div>

      {workflows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No workflows yet.</p>
          <Button asChild><Link href="/admin/workflows/new">Create Workflow</Link></Button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w, i) => (
                <tr key={w.id} className={`border-b border-border last:border-0 hover:bg-surface-secondary/30 transition-colors ${i % 2 === 0 ? "bg-surface" : "bg-surface/5"}`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/workflows/${w.id}`} className="text-sm font-medium hover:text-primary">{w.title}</Link>
                    {w.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{w.summary}</p>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {w.category ? <Badge variant="outline" className="text-xs">{w.category}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem asChild><Link href={`/admin/workflows/${w.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form action={async () => { "use server"; const { deleteWorkflow } = await import("prisma/data-actions"); await deleteWorkflow(w.id); }}>
                            <button type="submit" className="flex w-full items-center gap-2 text-destructive">Delete</button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FadeIn>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = { DRAFT: "bg-yellow-500/10 text-yellow-600", PUBLISHED: "bg-green-500/10 text-green-600", ARCHIVED: "bg-gray-500/10 text-gray-500" };
  return <Badge variant="outline" className={`text-xs font-medium ${s[status] || s.DRAFT}`}>{status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : "Archived"}</Badge>;
}
