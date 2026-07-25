"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FAQItem } from "@/types/preset";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  items: FAQItem[];
}

function FAQEntry({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-2xl border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: isOpen ? "var(--primary)" : "var(--border)",
        backgroundColor: isOpen
          ? "color-mix(in srgb, var(--primary) 4%, transparent)"
          : "var(--card-background)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium font-heading pr-4" style={{ color: "var(--foreground)" }}>
          {item.question}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-300"
          style={{
            color: "var(--primary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0">
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to know about visiting our clinic.
            </p>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <FAQEntry
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
