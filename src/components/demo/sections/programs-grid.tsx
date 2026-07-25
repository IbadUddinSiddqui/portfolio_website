"use client";

import { motion } from "motion/react";
import type { ProgramItem } from "@/types/preset";
import { cn } from "@/lib/utils";

// ─── Simple SVG icons for programs ─────────────────

function ProgramIcon({ name, className }: { name?: string; className?: string }) {
  const cls = cn("h-6 w-6", className);
  switch (name) {
    case "Zap":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "Dumbbell":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <path d="M14.4 14.4L9.6 9.6" />
          <path d="M18.657 5.343a1 1 0 010 1.414l-10.9 10.9a1 1 0 01-1.414 0l-2.828-2.828a1 1 0 010-1.414l10.9-10.9a1 1 0 011.414 0z" />
          <path d="M21.314 10.686l-1.414 1.414" />
          <path d="M4.1 19.9l2.828-2.828" />
        </svg>
      );
    case "Heart":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
  }
}

// ─── ProgramsGrid ────────────────────────────────────

interface ProgramsGridProps {
  programs: ProgramItem[];
}

export function ProgramsGrid({ programs }: ProgramsGridProps) {
  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase">
            Programs &amp; Classes
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every class is designed to push you further — whether you&apos;re
            just starting or chasing a new PR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program, i) => {
            const intensityColor =
              program.intensity === "High"
                ? "var(--secondary, #F97316)"
                : program.intensity === "Moderate"
                  ? "var(--primary, #A3E635)"
                  : "var(--muted-foreground)";

            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card-background)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${"var(--primary)"}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <ProgramIcon name={program.icon} />
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold font-heading uppercase tracking-wide">
                    {program.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                  {program.description}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {program.intensity && (
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${intensityColor}20`,
                        color: intensityColor,
                      }}
                    >
                      {program.intensity}
                    </span>
                  )}
                  {program.duration && (
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {program.duration}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
