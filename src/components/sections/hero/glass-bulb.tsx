"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  type ReactNode,
} from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────
   CONSTANTS  (exported so hero-section + particles share them)
   ───────────────────────────────────────────────────── */
export const BULB_ARM_LENGTH = 260; // px from pivot to bulb centre

/* ─────────────────────────────────────────────────────
   RESPONSIVE BULB SIZE
   ───────────────────────────────────────────────────── */
export function useBulbSize(): number {
  const [size, setSize] = useState(220);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setSize(w < 640 ? 150 : w < 1024 ? 185 : 220);
    };
    calc();
    window.addEventListener("resize", calc, { passive: true });
    return () => window.removeEventListener("resize", calc);
  }, []);
  return size;
}

/* ─────────────────────────────────────────────────────
   SPARKLE CANVAS
   ───────────────────────────────────────────────────── */
interface Spark {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  life: number; maxLife: number;
  hue: number;
}

function useSparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const idRef     = useRef(0);
  const rafRef    = useRef(0);
  const runRef    = useRef(false);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { runRef.current = false; return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { runRef.current = false; return; }

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    sparksRef.current = sparksRef.current
      .map(s => ({
        ...s,
        x: s.x + s.vx, y: s.y + s.vy,
        vy: s.vy + 0.06,
        life: s.life + 1,
        r: s.r * 0.955,
      }))
      .filter(s => s.life < s.maxLife);

    for (const s of sparksRef.current) {
      const a = Math.max(0, 1 - s.life / s.maxLife);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur  = s.r * 6;
      ctx.shadowColor = `hsl(199,${85 + Math.random() * 10}%,60%)`;
      ctx.fillStyle   = `hsl(199,80%,75%)`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.2, s.r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (sparksRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      runRef.current = false;
    }
  }, []);

  const emit = useCallback((cx: number, cy: number) => {
    for (let i = 0; i < 16; i++) {
      const a   = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
      const spd = 1.5 + Math.random() * 2.5;
      sparksRef.current.push({
        id: idRef.current++,
        x: cx, y: cy,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.6,
        r: 1.8 + Math.random() * 2.2,
        life: 0, maxLife: 40 + Math.random() * 20,
        hue: 199 + Math.random() * 30,
      });
    }
    if (!runRef.current) {
      runRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { canvasRef, emit };
}

/* ─────────────────────────────────────────────────────
   MAIN — GlassBulb
   ───────────────────────────────────────────────────── */
export function GlassBulb() {
  const reduced  = useReducedMotion();
  const bulbSize = useBulbSize();

  /* DOM refs written by RAF — zero React overhead */
  const stringRef = useRef<HTMLDivElement>(null);
  const bulbRef   = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);

  /*
   * Physics stored in a ref — never causes re-renders.
   * angle  : radians from vertical, positive = right
   * av     : angular velocity (rad / frame)
   */
  const phy = useRef({ angle: 0.22, av: 0.0, airTimer: 4 });
  const mouseRef   = useRef({ x: -9999, y: -9999, active: false });
  const glowMul    = useRef(1.0);
  const rafPhysics = useRef(0);
  const clickRef   = useRef(0); // pending click impulse

  const { canvasRef: sparkCanvas, emit: emitSparks } = useSparkleCanvas();

  /* Scroll fade */
  const { scrollYProgress } = useScroll();
  const rawOp = useTransform(scrollYProgress, [0, 0.18, 0.32], [1, 0.55, 0]);
  const rawSc = useTransform(scrollYProgress, [0, 0.25],       [1, 0.80]);
  const spOp  = useSpring(rawOp, { stiffness: 80, damping: 24 });
  const spSc  = useSpring(rawSc, { stiffness: 80, damping: 24 });

  /* ── Physics RAF ── */
  useEffect(() => {
    if (reduced) return;

    const p   = phy.current;
    const m   = mouseRef.current;
    const ARM = BULB_ARM_LENGTH;

    /*
     * Standard pendulum:
     *   α = -(g / L) × sin(θ)
     *
     * We work purely in angle-space.
     * dt is fixed at 1/60 s so behaviour is deterministic.
     *
     * To get a slow, elegant swing (~3+ second period):
     * - Use a larger effective L (makes period longer)
     * - Very light damping so it never dies
     * - Gentle air puffs keep it energized
     */
    const G  = 9.8;    // m/s²
    const Lm = 2.8;    // effective arm length (tune feel — larger = slower)
    const DAMPING   = 0.9995;  // per-frame energy loss (very light)
    const AIR_STR   = 0.003;   // air perturbation strength
    const AIR_INT   = [2, 5];  // seconds between air puffs [min, max]
    const MOUSE_F   = 0.00018;
    const MOUSE_R   = 220;     // px distance for mouse influence
    const MAX_AV    = 0.035;   // max angular velocity (rad/frame)
    const dt        = 1 / 60;

    let glowT = 0;

    const frame = () => {
      /* ── Pendulum acceleration ── */
      // α = -(g/L) × sin(θ)
      const alpha = -(G / Lm) * Math.sin(p.angle) * dt;
      p.av = (p.av + alpha) * DAMPING;

      /* ── Air puff (gentle random impulses) ── */
      p.airTimer -= dt;
      if (p.airTimer <= 0) {
        p.av += (Math.random() - 0.5) * AIR_STR;
        p.airTimer = AIR_INT[0] + Math.random() * (AIR_INT[1] - AIR_INT[0]);
      }

      /* ── Click impulse ── */
      if (clickRef.current !== 0) {
        p.av += clickRef.current;
        clickRef.current = 0;
        glowMul.current = 1.9;
      }

      /* ── Mouse repulsion ── */
      if (m.active && bulbRef.current) {
        const r  = bulbRef.current.getBoundingClientRect();
        const bx = r.left + r.width  / 2;
        const by = r.top  + r.height / 2;
        const dx = bx - m.x;
        const dy = by - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_R && dist > 1) {
          const frac = (MOUSE_R - dist) / MOUSE_R;
          /* Push laterally → angular impulse */
          p.av += (-dx / dist) * frac * MOUSE_F;
          glowMul.current += (1.6 - glowMul.current) * 0.06;
        } else {
          glowMul.current += (1.0 - glowMul.current) * 0.03;
        }
      } else {
        glowMul.current += (1.0 - glowMul.current) * 0.015;
      }

      /* ── Clamp angular velocity ── */
      if (p.av >  MAX_AV) p.av =  MAX_AV;
      if (p.av < -MAX_AV) p.av = -MAX_AV;

      /* ── Integrate angle ── */
      p.angle += p.av;

      /*
       * POSITIONAL MATH
       * Pivot is at (0, 0) in the pivot-div's coordinate space.
       * Bulb centre is always exactly ARM_LENGTH away from pivot.
       *
       * x = sin(angle) * ARM
       * y = (1 - cos(angle)) * ARM   ← height below vertical rest point
       *
       * Because the pivot div sits at top-center of the section,
       * the bulb's CSS position is:
       *   left = -bulbSize/2 + x       (centred on the arm tip)
       *   top  = ARM - bulbSize/2 + y  (ARM from pivot, then drop)
       */
      const sx = Math.sin(p.angle) * ARM;
      const sy = (1 - Math.cos(p.angle)) * ARM;

      /* ── DOM writes — bypass React completely ── */
      if (bulbRef.current) {
        bulbRef.current.style.transform =
          `translate(${sx}px, ${sy}px)`;
      }

      if (textRef.current) {
        /* Counter-rotate so text always reads upright */
        textRef.current.style.transform = `rotate(${-p.angle}rad)`;
      }

      /* String: rotate around its top-centre so it points at the bulb */
      if (stringRef.current) {
        stringRef.current.style.transform =
          `rotate(${p.angle}rad)`;
      }

      /* Glow intensity — per spec: center white, inner cyan, outer blue */
      glowT += dt;
      const pulse = 1 + Math.sin((glowT * Math.PI * 2) / 4) * 0.09;
      const gi    = Math.min(glowMul.current * pulse, 2.4);
      const s     = bulbSize;
      if (glowRef.current) {
        glowRef.current.style.boxShadow = [
          `0 0 ${s * 0.08}px rgba(255,255,255,${0.35 * gi})`,
          `0 0 ${s * 0.18}px rgba(125,211,252,${0.22 * gi})`,
          `0 0 ${s * 0.36}px rgba(56,189,248,${0.14 * gi})`,
          `0 0 ${s * 0.70}px rgba(56,189,248,${0.06 * gi})`,
        ].join(", ");
      }

      rafPhysics.current = requestAnimationFrame(frame);
    };

    rafPhysics.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafPhysics.current);
  }, [reduced, bulbSize]);

  /* ── Event listeners ── */
  useEffect(() => {
    const MAX_CLICK_IMPULSE = 0.038;

    const onMove  = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; mouseRef.current.active = true; };
    const onLeave = ()               => { mouseRef.current.active = false; };
    const onTouch = (e: TouchEvent)  => { mouseRef.current.x = e.touches[0].clientX; mouseRef.current.y = e.touches[0].clientY; mouseRef.current.active = true; };
    const onTEnd  = ()               => { mouseRef.current.active = false; };

    const onClick = (e: MouseEvent) => {
      if (!bulbRef.current) return;
      const r    = bulbRef.current.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      if (dist < bulbSize) {
        clickRef.current = (Math.random() > 0.5 ? 1 : -1) * MAX_CLICK_IMPULSE;
        emitSparks(r.left + r.width / 2, r.top + r.height / 2);
      }
    };

    window.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove",  onTouch, { passive: true });
    document.addEventListener("touchend", onTEnd);
    window.addEventListener("click",      onClick);
    return () => {
      window.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove",  onTouch);
      document.removeEventListener("touchend", onTEnd);
      window.removeEventListener("click",      onClick);
    };
  }, [bulbSize, emitSparks]);

  /* ── Reduced-motion static fallback ── */
  if (reduced) {
    return (
      <div
        className="absolute left-1/2"
        style={{
          top:  BULB_ARM_LENGTH - bulbSize / 2,
          transform: "translateX(-50%)",
          width: bulbSize, height: bulbSize,
        }}
        aria-hidden="true"
      >
        <GlassSphere size={bulbSize} glowRef={glowRef}>
          <BulbText size={bulbSize} />
        </GlassSphere>
      </div>
    );
  }

  return (
    <>
      {/* Sparkle overlay canvas */}
      <canvas
        ref={(el) => {
          if (!el) return;
          (sparkCanvas as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
          const dpr = window.devicePixelRatio || 1;
          el.width  = window.innerWidth  * dpr;
          el.height = window.innerHeight * dpr;
          el.style.width  = `${window.innerWidth}px`;
          el.style.height = `${window.innerHeight}px`;
          const ctx = el.getContext("2d");
          if (ctx) ctx.scale(dpr, dpr);
        }}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 20 }}
        aria-hidden="true"
      />

      {/*
        Pivot anchor — positioned at top-center of the section.
        Everything inside is in pivot-relative coordinates.
      */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none select-none"
        style={{ transform: "translateX(0)" }}   /* pivot x = 50% set by left:1/2 */
        aria-hidden="true"
      >
        {/*
          String — visible thin line with subtle glow.
          height = ARM_LENGTH, rotates around its own top-centre.
          transformOrigin must be "50% 0%" so it pivots from the attachment point.
        */}
        <div
          ref={stringRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: "1.5px",
            height: BULB_ARM_LENGTH,
            transformOrigin: "50% 0%",
            background: "linear-gradient(180deg, rgba(56,189,248,0.02) 0%, rgba(125,211,252,0.20) 25%, rgba(56,189,248,0.25) 50%, rgba(56,189,248,0.15) 75%, rgba(56,189,248,0.02) 100%)",
            boxShadow: "0 0 6px rgba(56,189,248,0.06), 0 0 2px rgba(56,189,248,0.10)",
          }}
        />

        {/*
          Bulb wrapper.
          Default (angle=0) resting position:
            top  = ARM_LENGTH - bulbSize/2   (bulb centred at arm tip)
            left = -bulbSize/2               (centred on the pivot's x-axis)
          Physics loop adds translate(sx, sy) on top of this.
        */}
        <motion.div
          ref={bulbRef}
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            top:    BULB_ARM_LENGTH - bulbSize / 2,
            left:   -bulbSize / 2,
            width:  bulbSize,
            height: bulbSize,
            opacity: spOp,
            scale:   spSc,
          }}
        >
          <GlassSphere size={bulbSize} glowRef={glowRef}>
            <BulbText ref={textRef} size={bulbSize} />
          </GlassSphere>
        </motion.div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   GLASS SPHERE
   ───────────────────────────────────────────────────── */
interface GlassSphereProps {
  size: number;
  glowRef?: React.Ref<HTMLDivElement>;
  children?: ReactNode;
}

function GlassSphere({ size, glowRef, children }: GlassSphereProps) {
  const s = (f: number) => size * f;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow — intensity written by physics loop */}
      <div ref={glowRef} className="absolute inset-0 rounded-full pointer-events-none" />

      {/* Glass body */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: [
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.15) 0%, transparent 44%)",
            "radial-gradient(circle at 70% 76%, rgba(125,211,252,0.06) 0%, transparent 44%)",
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.03) 0%, rgba(255,255,255,0.01) 38%, transparent 62%)",
          ].join(", "),
          backdropFilter:       "blur(22px) saturate(1.6) brightness(1.08)",
          WebkitBackdropFilter: "blur(22px) saturate(1.6) brightness(1.08)",
          border:    "1px solid rgba(255,255,255,0.11)",
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.03), inset 0 0 80px rgba(56,189,248,0.025)",
        }}
      >
        {/* Main specular — top-left */}
        <div className="absolute rounded-full" style={{
          top: "6%", left: "14%", width: "36%", height: "28%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.07) 32%, transparent 68%)",
          filter: "blur(3px)",
        }} />
        {/* Secondary specular */}
        <div className="absolute rounded-full" style={{
          top: "13%", right: "21%", width: "13%", height: "10%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(2px)",
        }} />
        {/* Bottom crescent */}
        <div className="absolute" style={{
          bottom: "5%", left: "12%", right: "12%", height: s(0.13),
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 80%, transparent)",
          filter: "blur(2px)", borderRadius: "50%",
        }} />
        {/* Top rim */}
        <div className="absolute top-0 left-[10%] right-[10%]" style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20) 50%, transparent)",
          filter: "blur(0.5px)",
        }} />        {/* Cool subsurface glow */}
        <div className="absolute rounded-full" style={{
          inset: "20%",
          background: "radial-gradient(circle at 50% 56%, rgba(125,211,252,0.04) 0%, transparent 60%)",
          filter: "blur(12px)",
        }} />
        {/* Refraction streak */}
        <div className="absolute" style={{
          top: "44%", left: "6%", width: "14%", height: "3%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          filter: "blur(2px)", transform: "rotate(-14deg)",
        }} />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Glass rim arc */}
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{
        border: "1px solid rgba(255,255,255,0.06)",
        mask:       "radial-gradient(circle at 28% 28%, black, transparent 62%)",
        WebkitMask: "radial-gradient(circle at 28% 28%, black, transparent 62%)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   BULB TEXT  (counter-rotated by physics loop)
   ───────────────────────────────────────────────────── */
interface BulbTextProps { size: number }

const BulbText = forwardRef<HTMLDivElement, BulbTextProps>(({ size }, ref) => {
  const reduced = useReducedMotion();
  const fs  = size * 0.108;
  const glow = "0 0 18px rgba(255,255,255,0.30), 0 0 36px rgba(125,211,252,0.16), 0 0 72px rgba(56,189,248,0.08)";

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center will-change-transform"
      animate={reduced ? undefined : { y: [0, -3, 0] }}
      transition={reduced ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="font-heading font-bold text-white select-none leading-[1.15]"
        style={{ fontSize: fs, letterSpacing: "0.19em", textShadow: glow }}>
        IBAD
      </span>
      <span className="font-heading font-bold text-white select-none leading-[1.15]"
        style={{ fontSize: fs, letterSpacing: "0.19em", textShadow: glow, marginTop: size * 0.018 }}>
        UDDIN
      </span>
    </motion.div>
  );
});
BulbText.displayName = "BulbText";
