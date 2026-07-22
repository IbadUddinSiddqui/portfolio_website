"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ProjectListItem } from "@/data/projects";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const complexityColors: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  advanced: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  expert: "text-violet-400 bg-violet-400/10 border-violet-400/20",
};

interface ProjectCardProps {
  project: ProjectListItem;
  index?: number;
}

/**
 * ProjectCard
 *
 * Premium card with:
 * - 3D tilt on hover (mouse-reactive via spring physics)
 * - Border glow sweep on hover
 * - Image scale + parallax on hover
 * - Shimmer overlay sweep
 * - Technology chips (up to 4)
 * - Category + complexity badges
 * - Arrow indicator
 *
 * All GPU-accelerated. Reduced motion fallback.
 */
export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Spring-based tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={prefersReducedMotion ? {} : { rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0, 1],
      }}
      className="group relative h-full"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full" tabIndex={0}>
        {/* Card surface */}
        <div
          className={cn(
            "relative h-full rounded-2xl border border-card-border/50 bg-card-background overflow-hidden",
            "transition-all duration-300",
            "group-hover:border-primary/30 group-hover:shadow-card-primary",
            "group-focus-within:border-primary/30"
          )}
        >
          {/* Gradient glow overlay — appears on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgb(99 102 241 / 0.04), transparent 60%)",
            }}
          />

          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10" />

          {/* Image */}
          <div className="aspect-[16/9] overflow-hidden bg-surface-secondary/50">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                width={600}
                height={338}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <span
                  className="text-6xl font-black text-muted-foreground/10 font-heading select-none"
                  aria-hidden="true"
                >
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {project.category && (
                <span className="px-2 py-0.5 rounded-md bg-primary/8 text-primary text-micro font-medium border border-primary/15">
                  {project.category.name}
                </span>
              )}
              {project.difficulty && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-micro font-medium border",
                    complexityColors[project.difficulty] ??
                      "text-muted-foreground bg-surface-secondary border-border"
                  )}
                >
                  {project.difficulty}
                </span>
              )}
              {project.pinned && (
                <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20 text-micro font-medium">
                  Pinned
                </span>
              )}
            </div>

            {/* Title row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {project.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-0.5" />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {project.shortDescription ?? "No description available."}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-micro bg-surface-secondary/80 text-muted-foreground font-mono border border-border/50"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-micro bg-surface-secondary/80 text-muted-foreground border border-border/50">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
