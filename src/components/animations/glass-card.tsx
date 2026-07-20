"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "section" | "article";
}

/**
 * GlassCard — premium glassmorphism card component
 * Features blur backdrop, subtle border, and optional hover elevation + glow.
 */
export function GlassCard({
  children,
  className,
  variant = "dark",
  hover = true,
  glow = false,
  as: Tag = "div",
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border p-6 transition-all duration-500",
        variant === "dark"
          ? "bg-background/40 backdrop-blur-xl border-border/50"
          : "bg-white/40 backdrop-blur-xl border-white/20",
        hover && [
          "hover:border-primary/20",
          "hover:shadow-float",
          "hover:-translate-y-0.5",
        ],
        glow && [
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:-z-10",
          "before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-secondary/5",
          "before:opacity-0 before:transition-opacity before:duration-500",
          "hover:before:opacity-100",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
