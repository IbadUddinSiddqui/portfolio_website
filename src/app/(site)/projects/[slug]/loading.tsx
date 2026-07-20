import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="container pt-24 pb-section">
      <Skeleton className="h-4 w-32 mb-8" />

      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />

        <div className="flex gap-3 mt-8">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="aspect-video rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
