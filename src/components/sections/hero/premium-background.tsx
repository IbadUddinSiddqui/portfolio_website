"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * PremiumBackground
 *
 * A sophisticated, layered background system:
 * 1. Base dark gradient with subtle radial depth
 * 2. Animated aurora orbs (CSS GPU accelerated)
 * 3. Animated mesh gradient (slow, organic movement)
 * 4. Subtle noise texture overlay
 * 5. Mouse-following spotlight
 * 6. Bottom fade-out for scroll transition
 *
 * All GPU-accelerated — no JS paint cost for aurora/mesh layers.
 * Respects prefers-reduced-motion.
 */
export function PremiumBackground() {
  const prefersReducedMotion = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId: number;

    const handleMouse = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    };

    const update = () => {
      // Spotlight follows cursor
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${mouseX}px ${mouseY}px, rgb(56 189 248 / 0.04), transparent 45%)`;
      }

      // Parallax orbs drift opposite cursor
      const cx = (mouseX / window.innerWidth - 0.5) * 2;
      const cy = (mouseY / window.innerHeight - 0.5) * 2;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${cx * -35}px, ${cy * -35}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${cx * 25}px, ${cy * 25}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${cx * -15}px, ${cy * -15}px)`;
      }
      if (meshRef.current) {
        meshRef.current.style.transform = `translate(${cx * -10}px, ${cy * -10}px)`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleMouse, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleMouse);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
      {/* Layer 1: Base dark gradient with depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background to-background" />

      {/* Layer 2: Radial depth */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Layer 3: Aurora orb — top left */}
      <div
        ref={orb1Ref}
        className="absolute -top-[25%] -left-[15%] w-[70%] aspect-square rounded-full transition-transform duration-1000 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
          filter: "blur(100px)",
          ...(!prefersReducedMotion && {
            animation: "aurora 14s ease-in-out infinite alternate",
          }),
        }}
      />

      {/* Layer 4: Aurora orb — bottom right */}
      <div
        ref={orb2Ref}
        className="absolute -bottom-[20%] -right-[10%] w-[55%] aspect-square rounded-full transition-transform duration-1000 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
          ...(!prefersReducedMotion && {
            animation: "aurora 18s ease-in-out infinite alternate-reverse",
          }),
        }}
      />

      {/* Layer 5: Accent orb — center right */}
      <div
        ref={orb3Ref}
        className="absolute top-[15%] right-[5%] w-[30%] aspect-square rounded-full transition-transform duration-1000 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
          ...(!prefersReducedMotion && {
            animation: "aurora 22s ease-in-out infinite alternate",
            animationDelay: "-6s",
          }),
        }}
      />

      {/* Layer 6: Animated mesh gradient */}
      <div
        ref={meshRef}
        className="absolute inset-0 opacity-[0.015] transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(37,99,235,0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, rgba(56,189,248,0.2) 0%, transparent 50%)",
          ].join(", "),
          ...(!prefersReducedMotion && {
            animation: "mesh 20s ease-in-out infinite alternate",
          }),
        }}
      />

      {/* Layer 7: Mouse spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
      />

      {/* Layer 8: Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Layer 9: Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Layer 10: Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Layer 11: Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)",
        }}
      />
    </div>
  );
}
