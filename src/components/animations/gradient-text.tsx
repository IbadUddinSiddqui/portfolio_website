import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

/**
 * GradientText — text with animated gradient color
 * Uses CSS background-clip for GPU-accelerated text gradient.
 * Optional animation sweeps the gradient across the text using a
 * Tailwind keyframe defined in globals.css.
 */
export function GradientText({
  children,
  className,
  as: Tag = "span",
  from = "var(--primary)",
  via,
  to = "var(--secondary)",
  animate = false,
}: GradientTextProps) {
  const gradient = via
    ? `linear-gradient(135deg, ${from}, ${via}, ${to})`
    : `linear-gradient(135deg, ${from}, ${to})`;

  return (
    <Tag
      className={cn(
        "bg-clip-text text-transparent",
        animate && "animate-gradient-shift",
        className
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: animate ? "200% 100%" : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
