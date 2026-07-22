"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const technologies = [
  { name: "Next.js", icon: "▲" },
  { name: "React", icon: "⚛" },
  { name: "TypeScript", icon: "TS" },
  { name: "Tailwind", icon: "🌊" },
  { name: "Prisma", icon: "◆" },
  { name: "Motion", icon: "✦" },
  { name: "Node.js", icon: "⬡" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "GraphQL", icon: "◉" },
  { name: "Figma", icon: "◈" },
  { name: "Vercel", icon: "▲" },
];

/**
 * TechStackMarquee
 *
 * Infinite horizontal scroll of technology chips.
 * Pauses on hover. GPU-accelerated CSS animation.
 * Edge fade via mask-image.
 */
export function TechStackMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const repeated = [...technologies, ...technologies];

  return (
    <div
      className="relative w-full overflow-hidden mask-fade-edges"
      role="list"
      aria-label="Technologies used"
    >
      <div
        className={cn(
          "flex gap-3 py-1",
          !prefersReducedMotion &&
            "animate-marquee hover:[animation-play-state:paused]"
        )}
      >
        {repeated.map((tech, i) => (
          <span
            key={`${tech.name}-${i}`}
            role="listitem"
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl",
              "bg-surface-secondary/40 border border-border/40",
              "text-xs text-muted-foreground font-medium",
              "backdrop-blur-sm",
              "transition-colors duration-200",
              "hover:border-primary/30 hover:text-foreground hover:bg-surface-secondary/70"
            )}
          >
            <span className="text-xxs opacity-60" aria-hidden="true">
              {tech.icon}
            </span>
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}
