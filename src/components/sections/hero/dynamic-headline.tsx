"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const words = [
  "software",
  "automation",
  "embedded systems",
  "AI solutions",
  "IoT devices",
  "digital products",
];

/**
 * DynamicHeadline — typewriter-style word rotator
 *
 * Cycles through engineering disciplines to demonstrate breadth.
 * Uses AnimatePresence for smooth exit/enter transitions.
 */
export function DynamicHeadline() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span className="text-gradient">
        {words[0]}
      </span>
    );
  }

  return (
    <span className="inline-block relative min-w-[6ch]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="text-gradient inline-block"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
