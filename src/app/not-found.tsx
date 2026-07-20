import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <FadeIn>
        <div className="text-center max-w-md">
          {/* Large 404 text */}
          <div className="text-[8rem] md:text-[10rem] font-heading font-bold leading-none text-gradient mb-4">
            404
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-3">
            Page not found
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">
                <Search className="mr-2 h-4 w-4" />
                View Projects
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
