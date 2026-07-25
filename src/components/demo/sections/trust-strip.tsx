"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TrustStat } from "@/types/preset";
import { cn } from "@/lib/utils";

// ─── Simple SVG icons for trust stats ─────────────────

function StatIcon({ name, className }: { name?: string; className?: string }) {
  const cls = cn("h-5 w-5", className);
  switch (name) {
    case "Calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "Users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "Star":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={cls}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "Award":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
  }
}

// ─── Animated counter ─────────────────────────────────

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const suffix = value.replace(/[0-9.]/g, "");
          const steps = 30;
          const stepTime = duration / steps;
          let current = 0;

          const timer = setInterval(() => {
            current++;
            const val = Math.min(current / steps, 1);
            const eased = 1 - Math.pow(1 - val, 3);
            const count = Math.round(eased * numeric);
            setDisplay(`${count}${suffix}`);
            if (current >= steps) clearInterval(timer);
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

// ─── TrustStrip ───────────────────────────────────────

interface TrustStripProps {
  stats: TrustStat[];
}

export function TrustStrip({ stats }: TrustStripProps) {
  return (
    <section className="relative py-16 md:py-20 bg-background-secondary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <StatIcon name={stat.icon} />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-heading tracking-tight mb-1"
                style={{ color: "var(--foreground)" }}
              >
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
