"use client";

import { motion, type MotionProps } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface StaggerProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
}

/**
 * Stagger animation wrapper
 * Staggers the animation of child elements with a cascading delay.
 * Each child appears with a fade+slide effect, one after another.
 */
export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  ...props
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — individual child item inside a Stagger wrapper.
 * Each item fades in and slides up with the stagger timing.
 */
export function StaggerItem({
  children,
  className,
  ...props
}: MotionProps & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
