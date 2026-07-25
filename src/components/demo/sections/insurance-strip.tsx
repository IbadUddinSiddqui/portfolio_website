"use client";

import { motion } from "motion/react";
import type { InsuranceInfo } from "@/types/preset";
import { ShieldCheck, CreditCard } from "lucide-react";

interface InsuranceStripProps {
  insurance: InsuranceInfo;
}

export function InsuranceStrip({ insurance }: InsuranceStripProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                opacity: 0.9,
              }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              We Work With Your Insurance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
              Insurance & Payment Options
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Quality dental care should be accessible. We accept most major
              insurance plans and offer flexible payment solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Insurance Providers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <h3 className="text-base font-semibold mb-4 font-heading flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={{ color: "var(--primary)" }} />
                Accepted Insurance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {insurance.providers.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: "var(--success, #10B981)" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <h3 className="text-base font-semibold mb-4 font-heading flex items-center gap-2">
                <CreditCard className="h-4 w-4" style={{ color: "var(--primary)" }} />
                Payment Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {insurance.paymentOptions.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: "var(--success, #10B981)" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {opt}
                  </div>
                ))}
              </div>
              {insurance.note && (
                <p className="text-xs mt-4 italic" style={{ color: "var(--muted-foreground)" }}>
                  {insurance.note}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
