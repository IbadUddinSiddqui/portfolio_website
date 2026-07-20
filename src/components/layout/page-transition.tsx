"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition
 *
 * Premium page transitions using Motion.
 * - Subtle fade + vertical slide only (blur removed — was causing an uncomfortable blurry-page feel on load)
 * - 350ms duration (snappier, less waiting)
 * - GPU-accelerated (opacity/transform only)
 * - Graceful fallback for reduced motion
 * - Works with App Router route changes
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 6 }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
        }
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -6 }
        }
        transition={{
          duration: prefersReducedMotion ? 0.1 : 0.35,
          ease: [0.25, 0.1, 0, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
