"use client";

import { motion } from "motion/react";
import type { StoryInfo } from "@/types/preset";

interface StoryStripProps {
  story: StoryInfo;
}

export function StoryStrip({ story }: StoryStripProps) {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--background-secondary), var(--card-background))",
              }}
            >
              {story.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${story.image})` }}
                />
              )}
              {/* Decorative plate overlay hint */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Decorative accent */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 font-heading">
              {story.title}
            </h2>

            <p className="text-base md:text-lg leading-relaxed mb-8 text-muted-foreground">
              {story.content}
            </p>

            {story.quote && (
              <div
                className="relative pl-6 border-l-2 py-2"
                style={{ borderColor: "var(--accent)" }}
              >
                <p
                  className="text-lg md:text-xl italic leading-relaxed font-heading"
                  style={{ color: "var(--foreground)" }}
                >
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
