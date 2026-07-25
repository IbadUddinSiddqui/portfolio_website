"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { EventInfo } from "@/types/preset";

interface EventsSectionProps {
  events: EventInfo[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-heading">
            Private Dining & Events
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From intimate celebrations to grand gatherings, we create
            memorable experiences for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border/50 bg-card-background/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image area */}
              <div
                className="h-40 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, var(--background-secondary), var(--muted))",
                }}
              >
                {event.image && (
                  <div
                    className="w-full h-full bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                )}
                {/* Fallback decorative pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%)",
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold font-heading mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>

                {event.capacity && (
                  <p
                    className="text-xs font-medium mb-4"
                    style={{ color: "var(--primary)" }}
                  >
                    Capacity: {event.capacity}
                  </p>
                )}

                {event.features && event.features.length > 0 && (
                  <ul className="space-y-2">
                    {event.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <Check
                          className="h-3.5 w-3.5 mt-0.5 shrink-0"
                          style={{ color: "var(--primary)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="tel:+12075550142"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Inquire About Events
          </a>
        </motion.div>
      </div>
    </section>
  );
}
