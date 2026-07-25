"use client";

import { cn } from "@/lib/utils";

interface DiagonalDividerProps {
  /** Direction of the diagonal slant */
  direction?: "up" | "down";
  /** Background color var to use (defaults to --background) */
  fromVar?: string;
  toVar?: string;
}

/**
 * DiagonalDivider
 *
 * A decorative diagonal strip between sections. Used by the gym preset
 * to create energetic section transitions.
 */
export function DiagonalDivider({
  direction = "down",
  fromVar = "var(--background)",
  toVar = "var(--background-secondary)",
}: DiagonalDividerProps) {
  return (
    <div
      className="relative h-16 md:h-20 -my-8 z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-x-0 h-full",
          direction === "down"
            ? "top-0"
            : "bottom-0"
        )}
        style={{
          background: `linear-gradient(135deg, ${fromVar}, ${toVar})`,
          clipPath:
            direction === "down"
              ? "polygon(0 0, 100% 30%, 100% 100%, 0 70%)"
              : "polygon(0 70%, 100% 30%, 100% 100%, 0 100%)",
          opacity: 0.12,
        }}
      />
    </div>
  );
}
