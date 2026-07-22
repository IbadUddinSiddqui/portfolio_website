import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const certs = await db.certification.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Certifications</h1>
          <p className="text-sm text-muted-foreground">Manage certifications and credentials.</p>
        </div>
        <Button asChild><Link href="/admin/certifications/new">New Certification</Link></Button>
      </div>
      {certs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No certifications yet.</p>
          <Button asChild><Link href="/admin/certifications/new">Add Certification</Link></Button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Issuer</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Featured</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c, i) => (
                <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-surface-secondary/30 ${i % 2 === 0 ? "bg-surface" : "bg-surface/5"}`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/certifications/${c.id}`} className="text-sm font-medium hover:text-primary">{c.title}</Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sm text-muted-foreground">{c.issuer}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{c.featured ? <span className="text-xs text-amber-500">★</span> : <span className="text-xs text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem asChild><Link href={`/admin/certifications/${c.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form action={async () => { "use server"; const { deleteCertification } = await import("prisma/data-actions"); await deleteCertification(c.id); }}>
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
