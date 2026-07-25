"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/preset";

interface MenuHighlightsProps {
  items: MenuItem[];
}

// ─── Category tabs ────────────────────────────────────

const ALL_CATEGORY = "All";

function useCategories(items: MenuItem[]) {
  const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  return [ALL_CATEGORY, ...cats] as string[];
}

// ─── MenuHighlights ────────────────────────────────────

export function MenuHighlights({ items }: MenuHighlightsProps) {
  const categories = useCategories(items);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const filtered =
    activeCategory === ALL_CATEGORY
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-heading">
            Menu Highlights
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A curated selection of our seasonal offerings — each dish crafted
            with locally sourced ingredients.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeCategory === cat
                  ? "shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground"
              )}
              style={
                activeCategory === cat
                  ? {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }
                  : undefined
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border/50 bg-card-background p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Image placeholder */}
                <div
                  className="w-full h-32 rounded-xl mb-4 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--background-secondary), var(--muted))",
                  }}
                >
                  {item.image && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold font-heading">
                    {item.name}
                  </h3>
                  <span
                    className="text-sm font-bold shrink-0 font-heading"
                    style={{ color: "var(--primary)" }}
                  >
                    {item.price}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Dietary badges */}
                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.dietary.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                          color: "var(--accent-foreground)",
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Full menu link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a
            href="#full-menu"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: "var(--primary)" }}
          >
            View Full Menu
            <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
