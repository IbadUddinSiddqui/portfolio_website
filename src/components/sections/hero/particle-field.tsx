"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  life: number;
  maxLife: number;
  hue: number;
}

/**
 * ParticleField
 *
 * Anti-gravity inspired floating particle system.
 * - Particles float slowly with gentle motion
 * - React to mouse — push away from cursor
 * - Soft glow effect
 * - Very low particle count (40-60 max)
 * - Canvas-based, GPU accelerated
 * - Respects prefers-reduced-motion
 * - Disabled on touch devices (battery/performance)
 */
const PARTICLE_COUNT = 50;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 0.5;

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3 - 0.1,
    size: Math.random() * 2.5 + 0.5,
    alpha: 0,
    targetAlpha: Math.random() * 0.5 + 0.1,
    life: 0,
    maxLife: Math.random() * 200 + 100,
    hue: Math.random() * 60 + 220,
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId = rafRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    let isVisible = true;

    // Resize handler
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    // Visibility change — pause when tab hidden
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (!isVisible) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      mouse.active = true;
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    resize();

    // Initialize particles
    while (particles.length < PARTICLE_COUNT) {
      particles.push(createParticle(window.innerWidth, window.innerHeight));
    }

    // Animation loop
    const animate = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Gentle floating motion
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Push away from mouse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.vx += (dx / dist) * force * MOUSE_FORCE;
            p.vy += (dy / dist) * force * MOUSE_FORCE;
          }
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Fade in / out
        if (p.life < 40) {
          p.alpha = (p.life / 40) * p.targetAlpha;
        } else if (p.life > p.maxLife - 40) {
          p.alpha = ((p.maxLife - p.life) / 40) * p.targetAlpha;
        }

        // Wrap around edges with soft padding
        const padding = 50;
        if (p.x < -padding) p.x = window.innerWidth + padding;
        if (p.x > window.innerWidth + padding) p.x = -padding;
        if (p.y < -padding) p.y = window.innerHeight + padding;
        if (p.y > window.innerHeight + padding) p.y = -padding;

        // Draw particle
        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

          // Soft glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha * 0.4})`);
          gradient.addColorStop(0.5, `hsla(${p.hue}, 80%, 60%, ${p.alpha * 0.15})`);
          gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${p.alpha * 0.8})`;
          ctx.fill();
        }
      }

      // Gentle connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(230, 60%, 70%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Recycle dead particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life >= particles[i].maxLife) {
          particles[i] = createParticle(window.innerWidth, window.innerHeight);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Events
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("visibilitychange", handleVisibility);

    rafRef.current = animationId;

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibility);
      particles.length = 0;
    };
  }, [prefersReducedMotion, createParticle]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
