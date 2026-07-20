"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type CursorState = "default" | "hover" | "text" | "pointer";

/**
 * CustomCursor
 *
 * Premium cursor system:
 * - Inner dot: snaps to cursor instantly (direct DOM)
 * - Outer ring: smooth spring-like trailing
 * - States: default / hover (enlarge + glow) / text (crosshair-like)
 * - mix-blend-difference for universal visibility
 * - Disabled on touch devices
 * - Respects prefers-reduced-motion
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true → SSR safe
  const prefersReducedMotion = useReducedMotion();

  // Ring position tracked outside React state (no re-renders)
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const detectTouch = useCallback(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    detectTouch();
  }, [detectTouch]);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const updateRing = () => {
      const lerp = 0.12;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(updateRing);
    };
    rafId.current = requestAnimationFrame(updateRing);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role='button'], label, select, [tabindex]:not([tabindex='-1'])")) {
        setState("hover");
      } else if (el.closest("input, textarea, [contenteditable]")) {
        setState("text");
      } else {
        setState("default");
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  if (isTouchDevice || prefersReducedMotion) return null;

  const isHover = state === "hover";
  const isText = state === "text";

  return (
    <>
      {/* Inner dot — no transition, snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: isHover ? 10 : 6,
          height: isHover ? 10 : 6,
          borderRadius: "50%",
          backgroundColor: "white",
          opacity: visible ? 1 : 0,
          marginLeft: isHover ? -5 : -3,
          marginTop: isHover ? -5 : -3,
          transition: "width 0.2s, height 0.2s, margin 0.2s, opacity 0.3s",
          willChange: "transform",
        }}
      />

      {/* Outer ring — spring-lags behind cursor */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference rounded-full border"
        style={{
          width: isHover ? 44 : isText ? 2 : 32,
          height: isHover ? 44 : isText ? 24 : 32,
          marginLeft: isHover ? -22 : isText ? -1 : -16,
          marginTop: isHover ? -22 : isText ? -12 : -16,
          borderColor: isHover
            ? "rgba(255,255,255,0.6)"
            : "rgba(255,255,255,0.25)",
          borderRadius: isText ? "2px" : "50%",
          backgroundColor: isHover ? "rgba(255,255,255,0.05)" : "transparent",
          opacity: visible ? 1 : 0,
          transition:
            "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), margin 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, opacity 0.3s, border-radius 0.2s, background-color 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
