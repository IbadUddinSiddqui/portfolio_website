"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface OrbitalParticle {
  theta: number;
  radius: number;
  speed: number;
  yOffset: number;
  ySpeed: number;
  yAmplitude: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  hue: number;
  phase: number;
  eccentricity: number;
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

import { BULB_ARM_LENGTH } from "./glass-bulb";

const PARTICLE_COUNT = 28;
const ORBIT_RADIUS_MIN = 140;
const ORBIT_RADIUS_MAX = 280;
const SPEED_MIN = 0.08;
const SPEED_MAX = 0.25;
const SIZE_MIN = 1.5;
const SIZE_MAX = 3.5;
const CURSOR_INFLUENCE_RADIUS = 250;
const CURSOR_INFLUENCE_STRENGTH = 15;
const ARM_LENGTH = BULB_ARM_LENGTH;

/* ═══════════════════════════════════════════════════════
   FACTORY
   ═══════════════════════════════════════════════════════ */

function createParticle(bulbSize: number): OrbitalParticle {
  const minR = bulbSize * 0.6 + ORBIT_RADIUS_MIN;
  const maxR = bulbSize * 0.6 + ORBIT_RADIUS_MAX;
  const radius = minR + Math.random() * (maxR - minR);

  return {
    theta: Math.random() * Math.PI * 2,
    radius,
    speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
    yOffset: (Math.random() - 0.5) * 80,
    ySpeed: 0.1 + Math.random() * 0.2,
    yAmplitude: 10 + Math.random() * 30,
    size: SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN),
    opacity: 0,
    targetOpacity: 0.15 + Math.random() * 0.35,
    hue: 210 + Math.random() * 60,
    phase: Math.random() * Math.PI * 2,
    eccentricity: 0.3 + Math.random() * 0.4,
  };
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface OrbitingParticlesProps {
  /** Bulb size for orbit radius calculation */
  bulbSize: number;
}

/**
 * OrbitingParticles
 *
 * Gently orbits soft-glowing particles around the glass bulb.
 * Bulb center is calculated from viewport dimensions matching
 * the pendulum position, avoiding brittle DOM queries.
 *
 * - Low particle count (28)
 * - Elliptical orbits with vertical oscillation
 * - Canvas-based for zero DOM overhead
 */
export function OrbitingParticles({ bulbSize }: OrbitingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbitalParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isVisible = true;
    let time = 0;

    // Calculate the bulb center based on the same pendulum math as GlassBulb
    const getCenter = () => {
      return {
        x: window.innerWidth / 2,
        // Pivot is at top=0, bulb translates by ARM_LENGTH down, center of bulb = ARM_LENGTH + bulbSize/2
        y: ARM_LENGTH + bulbSize / 2,
      };
    };

    // ── Resize ──
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    // ── Initialize particles ──
    const initParticles = () => {
      const particles: OrbitalParticle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(bulbSize));
      }
      particlesRef.current = particles;
    };

    // ── Mouse handler ──
    const handleMouse = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      } else if ("clientX" in e) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    // ── Visibility ──
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (!isVisible) {
        cancelAnimationFrame(rafRef.current);
      } else {
        animate();
      }
    };

    // ── Animation loop ──
    const animate = () => {
      if (!isVisible) return;

      time += 0.016;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const c = getCenter();
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── Update orbital position ──
        p.theta += p.speed * 0.016;

        const cosT = Math.cos(p.theta);
        const sinT = Math.sin(p.theta);
        const rx = p.radius;
        const ry = p.radius * (1 - p.eccentricity);

        let px = c.x + cosT * rx;
        let py = c.y + sinT * ry;

        // Vertical oscillation (floating)
        py += Math.sin(time * p.ySpeed + p.phase) * p.yAmplitude;
        py += p.yOffset;

        // ── Mouse influence ──
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_INFLUENCE_RADIUS) {
          const force =
            ((CURSOR_INFLUENCE_RADIUS - dist) / CURSOR_INFLUENCE_RADIUS) *
            CURSOR_INFLUENCE_STRENGTH;
          if (dist > 0) {
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        // ── Opacity ──
        const fadeSpeed = 0.003;
        if (p.opacity < p.targetOpacity) {
          p.opacity = Math.min(p.opacity + fadeSpeed, p.targetOpacity);
        } else {
          p.opacity = Math.max(p.opacity - fadeSpeed * 0.3, p.targetOpacity);
        }

        const opOscillation = Math.sin(time * 0.3 + p.phase) * 0.2;
        const finalOpacity = Math.max(
          0,
          Math.min(p.opacity + opOscillation, p.targetOpacity + 0.2)
        );

        // ── Draw ──
        if (finalOpacity > 0.01) {
          // Glow aura
          const auraGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5);
          auraGrad.addColorStop(0, `hsla(${p.hue}, 70%, 70%, ${finalOpacity * 0.3})`);
          auraGrad.addColorStop(0.4, `hsla(${p.hue}, 70%, 60%, ${finalOpacity * 0.1})`);
          auraGrad.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`);
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 5, 0, Math.PI * 2);
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${finalOpacity * 0.7})`;
          ctx.fill();

          // Inner bright core
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 95%, ${finalOpacity * 0.9})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleMouse, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleMouse);
      document.removeEventListener("visibilitychange", handleVisibility);
      particlesRef.current = [];
    };
  }, [bulbSize, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
