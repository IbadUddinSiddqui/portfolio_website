"use client";

import { motion } from "motion/react";
import type { GalleryItem } from "@/types/preset";

// ─── Consistent soft-gradient avatar ─────────────────

function GalleryAvatar({ name }: { name: string }) {
  const hue = (name.length * 47 + 10) % 360;
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 50) % 360}, 60%, 45%))`,
      }}
    >
      {name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
    </div>
  );
}

// ─── TransformationGallery ───────────────────────────

interface TransformationGalleryProps {
  items: GalleryItem[];
}

export function TransformationGallery({ items }: TransformationGalleryProps) {
  const transformations = items.filter((i) => i.category === "Transformation");
  const others = items.filter((i) => i.category !== "Transformation");

  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading uppercase">
            Real Results
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every number represents a real person who showed up, put in the work,
            and transformed.
          </p>
        </div>

        {/* Featured transformations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {transformations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl border overflow-hidden group"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              {/* Gradient accent top bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                }}
              />

              <div className="p-5 md:p-6 text-center">
                <div className="flex justify-center mb-4">
                  <GalleryAvatar name={item.name} />
                </div>
                <h3 className="text-lg font-semibold font-heading uppercase tracking-wide mb-1">
                  {item.name}
                </h3>
                <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                  {item.achievement}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other achievements in a compact row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {others.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="rounded-2xl border p-5 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <div className="flex justify-center mb-3">
                <GalleryAvatar name={item.name} />
              </div>
              <h3 className="text-base font-semibold font-heading uppercase tracking-wide mb-0.5">
                {item.name}
              </h3>
              <p className="text-xs" style={{ color: "var(--primary)" }}>
                {item.achievement}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
