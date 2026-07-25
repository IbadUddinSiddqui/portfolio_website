"use client";

import { motion } from "motion/react";
import type { FacilityItem } from "@/types/preset";

// ─── Simple SVG icons ─────────────────────────────────

function FacilityIcon({ name, className }: { name?: string; className?: string }) {
  switch (name) {
    case "Dumbbell":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M14.4 14.4L9.6 9.6" />
          <path d="M18.657 5.343a1 1 0 010 1.414l-10.9 10.9a1 1 0 01-1.414 0l-2.828-2.828a1 1 0 010-1.414l10.9-10.9a1 1 0 011.414 0z" />
          <path d="M21.314 10.686l-1.414 1.414" />
          <path d="M4.1 19.9l2.828-2.828" />
        </svg>
      );
    case "Zap":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "Heart":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
  }
}

// ─── FacilityTour ─────────────────────────────────────

interface FacilityTourProps {
  items: FacilityItem[];
}

export function FacilityTour({ items }: FacilityTourProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase">
            Facility Tour
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            15,000 sq ft of premium training space — every detail designed for
            your performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <FacilityIcon name={item.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold font-heading uppercase tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
