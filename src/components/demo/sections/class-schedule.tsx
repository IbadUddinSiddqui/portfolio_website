"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ClassScheduleItem } from "@/types/preset";
import { cn } from "@/lib/utils";

interface ClassScheduleProps {
  schedule: ClassScheduleItem[];
}

// ─── Level badge colors ──────────────────────────────

function LevelBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Beginner: "var(--success, #22C55E)",
    Intermediate: "var(--secondary, #F97316)",
    Advanced: "var(--error, #EF4444)",
  };
  const color = colorMap[level] || "var(--muted-foreground)";

  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: `${color}20`,
        color,
      }}
    >
      {level}
    </span>
  );
}

// ─── DayColumn (desktop) ─────────────────────────────

function DayColumn({
  day,
  classes,
  isSelected,
  onSelect,
}: {
  day: string;
  classes: ClassScheduleItem["classes"];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 cursor-pointer",
        isSelected ? "scale-[1.02]" : "hover:border-primary/30"
      )}
      style={{
        borderColor: isSelected ? "var(--primary)" : "var(--border)",
        backgroundColor: isSelected
          ? "color-mix(in srgb, var(--primary) 6%, var(--card-background))"
          : "var(--card-background)",
      }}
      onClick={onSelect}
    >
      <div
        className="px-4 py-3 text-center border-b font-semibold font-heading uppercase tracking-wide text-sm"
        style={{
          borderColor: "var(--border)",
          color: isSelected ? "var(--primary)" : "var(--foreground)",
        }}
      >
        {day.slice(0, 3)}
      </div>
      <div className="p-3 space-y-2">
        {classes.map((cls) => (
          <div
            key={`${cls.time}-${cls.name}`}
            className="text-[11px] leading-tight pb-2 border-b last:border-b-0"
            style={{ borderColor: "var(--border)", opacity: 0.85 }}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="font-semibold text-[10px] uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                {cls.time}
              </span>
              <LevelBadge level={cls.level} />
            </div>
            <div className="font-medium font-heading uppercase tracking-wide">{cls.name}</div>
            <div style={{ color: "var(--muted-foreground)" }}>{cls.trainer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile schedule (accordion) ─────────────────────

function MobileDaySection({
  day,
  classes,
  isOpen,
  onToggle,
}: {
  day: string;
  classes: ClassScheduleItem["classes"];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold font-heading uppercase tracking-wide"
        style={{
          backgroundColor: isOpen ? "color-mix(in srgb, var(--primary) 6%, var(--card-background))" : "var(--card-background)",
        }}
      >
        <span>{day}</span>
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          style={{ color: "var(--primary)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {classes.map((cls) => (
                <div key={`${cls.time}-${cls.name}`} className="text-sm">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-xs" style={{ color: "var(--primary)" }}>
                      {cls.time}
                    </span>
                    <LevelBadge level={cls.level} />
                  </div>
                  <div className="font-semibold font-heading uppercase tracking-wide text-sm">
                    {cls.name}
                  </div>
                  <div style={{ color: "var(--muted-foreground)" }} className="text-xs">
                    {cls.trainer}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ClassSchedule ────────────────────────────────────

export function ClassSchedule({ schedule }: ClassScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(schedule[0]?.day || null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase">
            Class Schedule
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Book your spot — classes fill fast. All levels welcome.
          </p>
        </div>

        {/* Desktop: scrollable row of day columns */}
        <div className="hidden md:block">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollbarWidth: "thin" }}
          >
            {schedule.map((day) => (
              <div key={day.day} className="min-w-[180px] snap-start">
                <DayColumn
                  day={day.day}
                  classes={day.classes}
                  isSelected={selectedDay === day.day}
                  onSelect={() => setSelectedDay(day.day)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden space-y-3">
          {schedule.map((day) => (
            <MobileDaySection
              key={day.day}
              day={day.day}
              classes={day.classes}
              isOpen={mobileOpen === day.day}
              onToggle={() => setMobileOpen(mobileOpen === day.day ? null : day.day)}
            />
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          Schedule may vary on holidays. Download our app for real-time updates.
        </p>
      </div>
    </section>
  );
}
