"use client";

import { motion, type MotionProps } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface FadeInProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

/**
 * FadeIn animation component
 * Animates children with a fade + directional slide on viewport entry.
 * GPU-accelerated (transform/opacity only). Respects reduced motion.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  const directionOffset = {
    up:    { initial: { y: 24 },  animate: { y: 0 } },
    down:  { initial: { y: -24 }, animate: { y: 0 } },
    left:  { initial: { x: 24 },  animate: { x: 0 } },
    right: { initial: { x: -24 }, animate: { x: 0 } },
    none:  { initial: {},          animate: {} },
  };

  const { initial: dirInitial, animate: dirAnimate } = directionOffset[direction];

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...dirInitial }}
      whileInView={{ opacity: 1, ...dirAnimate }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
