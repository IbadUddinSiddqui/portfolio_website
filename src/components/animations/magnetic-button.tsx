"use client";

import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  strength?: number;
}

/**
 * MagneticButton — button that follows the cursor with a magnetic pull effect.
 * Uses CSS transforms for GPU acceleration. Falls back to static on reduced motion.
 */
export function MagneticButton({
  children,
  className,
  as: Tag = "button",
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Tag
      ref={ref as any}
      href={Tag === "a" ? href : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center justify-center transition-[transform,box-shadow] duration-300 ease-out-expo",
        !prefersReducedMotion && "will-change-transform",
        className
      )}
      style={
        !prefersReducedMotion
          ? {
              transform: `translate(${position.x}px, ${position.y}px)`,
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
