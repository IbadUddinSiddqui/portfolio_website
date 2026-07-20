"use client";

import { useEffect, useRef } from "react";

/**
 * InteractiveBackground
 *
 * 7-layer premium background system:
 * 1. Base radial gradient (dark vignette)
 * 2. Large aurora orbs (CSS animated)
 * 3. Mouse-reactive parallax blobs
 * 4. Spotlight following cursor (radial gradient)
 * 5. Grid overlay (subtle)
 * 6. Noise texture
 * 7. Bottom fade-out
 *
 * All GPU-accelerated (transform/opacity). No JS paint cost.
 */
export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const update = () => {
      // Update spotlight
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgb(99 102 241 / 0.05), transparent 40%)`;
      }
      // Parallax blobs
      const cx = (mouseX / window.innerWidth - 0.5);
      const cy = (mouseY / window.innerHeight - 0.5);
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate(${cx * -40}px, ${cy * -40}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate(${cx * 30}px, ${cy * 30}px)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translate(${cx * -20}px, ${cy * -20}px)`;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden -z-10"
      aria-hidden="true"
    >
      {/* Layer 1: Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Layer 2: Aurora orb — top left (slow CSS animation) */}
      <div
        ref={blob1Ref}
        className="absolute -top-[30%] -left-[20%] w-[80%] aspect-square rounded-full opacity-30 dark:opacity-20 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora 12s ease-in-out infinite alternate",
        }}
      />

      {/* Layer 3: Aurora orb — bottom right */}
      <div
        ref={blob2Ref}
        className="absolute -bottom-[20%] -right-[15%] w-[60%] aspect-square rounded-full opacity-25 dark:opacity-15 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora 16s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Layer 4: Accent orb — center right */}
      <div
        ref={blob3Ref}
        className="absolute top-[20%] right-[5%] w-[35%] aspect-square rounded-full opacity-15 dark:opacity-10 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora 20s ease-in-out infinite alternate",
          animationDelay: "-5s",
        }}
      />

      {/* Layer 5: Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
      />

      {/* Layer 6: Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Layer 7: Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Layer 8: Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
