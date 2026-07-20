import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { ProjectEditForm } from "./project-edit-form";

export const dynamic = "force-dynamic";

async function getProject(id: string) {
  const project = await db.project.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!project) notFound();
  return project;
}

async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const categories = await getCategories();

  if (isNew) {
    return (
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            New Project
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new portfolio project.
          </p>
        </div>

        <ProjectEditForm project={null} categories={categories} />
      </FadeIn>
    );
  }

  const project = await getProject(id);
  const technologies = parseJsonArray(project.technologies);
  const skillsLearned = parseJsonArray(project.skillsLearned);

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Edit Project
        </h1>
        <p className="text-sm text-muted-foreground">
          Editing &quot;{project.title}&quot;
        </p>
      </div>

      <ProjectEditForm
        project={{ ...project, technologies: [...technologies, ...skillsLearned], status: project.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }}
        categories={categories}
      />
    </FadeIn>
  );
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
