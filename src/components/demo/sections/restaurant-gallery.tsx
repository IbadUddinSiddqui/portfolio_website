"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/preset";

interface RestaurantGalleryProps {
  images: GalleryImage[];
}

const ALL_CATEGORY = "All";

export function RestaurantGallery({ images }: RestaurantGalleryProps) {
  const categories = [ALL_CATEGORY, "food", "ambiance", "interior"] as const;
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  const filtered =
    activeCategory === ALL_CATEGORY
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-heading">
            Our Gallery
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A visual journey through our kitchen, dining room, and the moments
            that make Locale special.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200",
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

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "group relative rounded-xl overflow-hidden cursor-pointer",
                  i === 0 ? "sm:col-span-2 sm:row-span-2" : "aspect-square"
                )}
                style={{
                  background:
                    "linear-gradient(135deg, var(--background-secondary), var(--muted))",
                }}
              >
                {/* Image */}
                {img.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${img.image})` }}
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Title on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                  <p className="text-white/70 text-xs capitalize mt-0.5">
                    {img.category}
                  </p>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#FFFFFF",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
