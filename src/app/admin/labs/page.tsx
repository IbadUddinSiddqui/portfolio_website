import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

async function getLabs() {
  return db.lab.findMany({ orderBy: { updatedAt: "desc" } });
}

export default async function AdminLabsPage() {
  const labs = await getLabs();

  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Labs</h1>
          <p className="text-sm text-muted-foreground">
            Engineering lab experiments and projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/labs/new">New Lab</Link>
        </Button>
      </div>

      {labs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            No labs yet. Create your first lab entry.
          </p>
          <Button asChild>
            <Link href="/admin/labs/new">Create Lab</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Updated</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab, i) => (
                <tr key={lab.id} className={`border-b border-border last:border-0 hover:bg-surface-secondary/30 transition-colors ${i % 2 === 0 ? "bg-surface" : "bg-surface/5"}`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/labs/${lab.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                      {lab.title}
                    </Link>
                    {lab.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lab.summary}</p>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {lab.category ? <Badge variant="outline" className="text-xs">{lab.category}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={lab.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{new Date(lab.updatedAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Actions</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/labs/${lab.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form action={async () => {
                            "use server";
                            const { deleteLab } = await import("prisma/data-actions");
                            await deleteLab(lab.id);
                          }}>
                            <button type="submit" className="flex w-full items-center gap-2 text-destructive">
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
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
  const styles: Record<string, string> = {
    DRAFT: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
    PUBLISHED: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
    ARCHIVED: "bg-gray-500/10 text-gray-500 border-gray-200 dark:border-gray-700",
  };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${styles[status] || styles.DRAFT}`}>
      {status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : "Archived"}
    </Badge>
  );
}
