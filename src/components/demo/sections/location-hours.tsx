"use client";

import { motion } from "motion/react";
import type { LocationInfo } from "@/types/preset";
import { MapPin, Clock, Phone } from "lucide-react";

interface LocationHoursProps {
  location: LocationInfo;
}

export function LocationHours({ location }: LocationHoursProps) {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
            Visit Us
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We&apos;re conveniently located and look forward to welcoming you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Address */}
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-heading mb-1">Address</h3>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {location.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-heading mb-1">Office Hours</h3>
                </div>
              </div>
              <div className="space-y-1.5 pl-[3.25rem]">
                {location.hours.map((slot) => (
                  <div key={slot.day} className="flex justify-between text-sm">
                    <span style={{ color: "var(--foreground)" }}>{slot.day}</span>
                    <span style={{ color: "var(--muted-foreground)" }}>{slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-background)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-heading mb-1">Call Us</h3>
                  <a
                    href={`tel:${location.phone}`}
                    className="text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--primary)" }}
                  >
                    {location.phone}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--border)",
              minHeight: "300px",
            }}
          >
            {location.mapUrl ? (
              <iframe
                title="Clinic Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ minHeight: "320px", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  minHeight: "320px",
                  backgroundColor: "var(--muted)",
                }}
              >
                <div className="text-center p-6">
                  <MapPin className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--muted-foreground)" }} />
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {location.address}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
