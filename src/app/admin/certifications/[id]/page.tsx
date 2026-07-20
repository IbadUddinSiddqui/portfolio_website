import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { CertForm } from "./cert-form";

export const dynamic = "force-dynamic";

async function getCert(id: string) {
  if (id === "new") return null;
  const c = await db.certification.findUnique({ where: { id } });
  if (!c) notFound();
  return c;
}

export default async function AdminCertEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await getCert(id);
  return (
    <FadeIn>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{id === "new" ? "New Certification" : "Edit Certification"}</h1>
          <p className="text-sm text-muted-foreground">{id === "new" ? "Add a new certification." : `Editing "${cert?.title}"`}</p>
        </div>
        <Button variant="outline" asChild><Link href="/admin/certifications">Back</Link></Button>
      </div>
      <div className="max-w-3xl"><CertForm cert={cert} /></div>
    </FadeIn>
  );
}
