"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { CalendarDays, Clock, Users, Phone, Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationsFormProps {
  note?: string;
  phoneReservation?: boolean;
}

export function ReservationsForm({ note, phoneReservation }: ReservationsFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone is required";
    } else if (!/^[\d\s\-+()]{7,}$/.test(formData.phone)) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!formData.date) errs.date = "Please select a date";
    if (!formData.time) errs.time = "Please select a time";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (submitted) {
    return (
      <section className="py-20 md:py-28 bg-background-secondary">
        <div className="container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle
              className="h-16 w-16 mx-auto mb-6"
              style={{ color: "var(--primary)" }}
            />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
              Reservation Request Sent
            </h2>
            <p className="text-muted-foreground mb-8">
              We&apos;ll confirm your booking within 2 hours during operating
              hours. If you need immediate assistance, please call us.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  date: "",
                  time: "",
                  guests: "2",
                  notes: "",
                });
              }}
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Make Another Reservation
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-heading">
            Reserve Your Table
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We can&apos;t wait to host you. Fill out the form below and we&apos;ll
            confirm your booking within 2 hours.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/50 bg-card-background p-6 md:p-8 shadow-sm"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="res-name"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Full Name *
              </label>
              <input
                id="res-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl text-sm border bg-background transition-all duration-200",
                  "focus:outline-none focus:ring-2",
                  errors.name
                    ? "border-[var(--error)] focus:ring-[var(--error)]"
                    : "border-border focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                )}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="res-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Email *
              </label>
              <input
                id="res-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl text-sm border bg-background transition-all duration-200",
                  "focus:outline-none focus:ring-2",
                  errors.email
                    ? "border-[var(--error)] focus:ring-[var(--error)]"
                    : "border-border focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                )}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="res-phone"
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Phone *
            </label>
            <input
              id="res-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm border bg-background transition-all duration-200",
                "focus:outline-none focus:ring-2",
                errors.phone
                  ? "border-[var(--error)] focus:ring-[var(--error)]"
                  : "border-border focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              )}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Date + Time + Guests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="res-date"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                <CalendarDays className="inline h-3 w-3 mr-1" />
                Date *
              </label>
              <input
                id="res-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl text-sm border bg-background transition-all duration-200",
                  "focus:outline-none focus:ring-2",
                  errors.date
                    ? "border-[var(--error)] focus:ring-[var(--error)]"
                    : "border-border focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                )}
              />
              {errors.date && (
                <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="res-time"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                <Clock className="inline h-3 w-3 mr-1" />
                Time *
              </label>
              <input
                id="res-time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl text-sm border bg-background transition-all duration-200",
                  "focus:outline-none focus:ring-2",
                  errors.time
                    ? "border-[var(--error)] focus:ring-[var(--error)]"
                    : "border-border focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                )}
              />
              {errors.time && (
                <p className="text-xs mt-1" style={{ color: "var(--error)" }}>
                  {errors.time}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="res-guests"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                <Users className="inline h-3 w-3 mr-1" />
                Guests
              </label>
              <select
                id="res-guests"
                value={formData.guests}
                onChange={(e) => handleChange("guests", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
                <option value="8+">8+ (Call us)</option>
              </select>
            </div>
          </div>

          {/* Special notes */}
          <div className="mb-6">
            <label
              htmlFor="res-notes"
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Special Requests
            </label>
            <textarea
              id="res-notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[var(--primary)] focus:ring-[var(--primary)] resize-none"
              placeholder="Allergies, dietary restrictions, celebrations..."
            />
          </div>

          {/* Note */}
          {note && (
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {note}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Confirm Reservation
            </button>

            {phoneReservation && (
              <a
                href="tel:+12075550142"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                Call to Book
              </a>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
