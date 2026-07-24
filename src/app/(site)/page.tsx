import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { FeaturedProjects } from "@/components/sections/projects/featured-projects";
import { DynamicStatsBar } from "@/components/sections/home/dynamic-stats-bar";
import { CurrentLearning } from "@/components/sections/home/current-learning";
import { EngineeringLabs } from "@/components/sections/home/engineering-labs";
import { AutomationWorkflows } from "@/components/sections/home/automation-workflows";
import { SkillsShowcase } from "@/components/sections/home/skills-showcase";
import { ClientWork } from "@/components/sections/home/client-work";
import { getFeaturedProjects } from "@/data/projects";

// ISR: revalidate every hour; falls back to dynamic if DB is unreachable during build.
export const revalidate = 3600;

/**
 * Home Page
 *
 * Dynamic sections pulling from CMS:
 * 1. Hero — cinematic first impression
 * 2. Stats Bar — live counts from database
 * 3. Featured Projects — DB-driven, staggered reveal
 * 4. Current Learning — technologies being studied
 * 5. Engineering Labs — published lab experiments
 * 6. Automation Workflows — n8n workflow showcase
 * 7. Skills Showcase — technology categories from DB
 * 8. Client Work — projects with client associations
 * 9. Testimonials — infinite marquee
 */
export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <HeroSection />

      {/* ── Stats Bar (dynamic from DB) ─────────────── */}
      <Suspense fallback={null}>
        <DynamicStatsBar />
      </Suspense>

      {/* ── Featured Projects ─────────────────────────── */}
      <Suspense fallback={null}>
        {featuredProjects.length > 0 && (
          <FeaturedProjects projects={featuredProjects} />
        )}
      </Suspense>

      {/* ── Current Learning ──────────────────────────── */}
      <Suspense fallback={null}>
        <CurrentLearning />
      </Suspense>

      {/* ── Engineering Labs ──────────────────────────── */}
      <Suspense fallback={null}>
        <EngineeringLabs />
      </Suspense>

      {/* ── Automation Workflows ──────────────────────── */}
      <Suspense fallback={null}>
        <AutomationWorkflows />
      </Suspense>

      {/* ── Skills Showcase ───────────────────────────── */}
      <Suspense fallback={null}>
        <SkillsShowcase />
      </Suspense>

      {/* ── Client Work ───────────────────────────────── */}
      <Suspense fallback={null}>
        <ClientWork />
      </Suspense>
    </>
  );
}
