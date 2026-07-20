"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

/**
 * TextReveal — animates text character-by-character
 * Each character fades and slides up for a premium reveal effect.
 * GPU accelerated. Respects reduced motion.
 */
export function TextReveal({
  children,
  className,
  delay = 0,
  once = true,
  as: Tag = "p",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(" ");

  return (
    <Tag className={cn("inline", className)}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        transition={{ staggerChildren: 0.04, delayChildren: delay }}
        aria-label={children}
        style={{ display: "inline", perspective: "600px" }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block overflow-hidden">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                variants={{
                  hidden: { opacity: 0, y: "100%" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.4,
                      ease: [0.25, 0.1, 0, 1],
                    },
                  },
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
