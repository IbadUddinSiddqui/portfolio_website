"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * AvailabilityBadge
 *
 * Shows current status: Student at NED University, Open for freelance.
 */
export function AvailabilityBadge() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-medium text-primary/90"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2" aria-label="Available for work">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-primary ${
            !prefersReducedMotion ? "animate-ping" : ""
          } opacity-75`}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="hidden sm:inline">Student at NED University</span>
      <span className="sm:hidden">NED '25</span>
      <span className="hidden md:inline text-primary/40 mx-0.5">·</span>
      <span className="hidden md:inline text-primary/70">Open for freelance</span>
    </motion.div>
  );
}
