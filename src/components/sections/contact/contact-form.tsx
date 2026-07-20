"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createMessage } from "prisma/data-actions";
import { CheckCircle, Send, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Validation Schema ───────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().max(200, "Subject must be under 200 characters").optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

type FormData = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

// ─── Floating Label Input ────────────────────────────

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  multiline,
  rows = 4,
  maxLength,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = focused || hasValue;

  const Tag = multiline ? "textarea" : "input";

  return (
    <div className="relative">
      <Tag
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        maxLength={maxLength}
        className={cn(
          "peer w-full bg-transparent rounded-xl border px-4 pt-5 pb-2.5",
          "text-sm text-foreground placeholder-transparent",
          "transition-all duration-200 outline-none",
          "focus:ring-2 focus:ring-primary/30",
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
            : "border-border/50 hover:border-border focus:border-primary"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none",
          "text-muted-foreground",
          isActive
            ? "top-2 text-[10px] font-medium"
            : "top-1/2 -translate-y-1/2 text-sm",
          multiline && isActive && "top-2",
          multiline && !isActive && "top-5",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-destructive mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component ───────────────────────────────────────

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function updateField(field: keyof FormData, value: string) {
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

  function validate(): boolean {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrorsMap = (result.error.flatten() as any).fieldErrors as Record<string, string[]>;
      const newErrors: FieldErrors = {};
      for (const [field, msgs] of Object.entries(fieldErrorsMap)) {
        if (msgs && msgs.length > 0) {
          newErrors[field as keyof FormData] = msgs[0];
        }
      }
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setState("loading");

    try {
      await createMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || undefined,
        message: formData.message,
      });
      setState("success");
      toast.success("Message sent successfully!", {
        icon: <Sparkles className="h-4 w-4 text-success" />,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setState("error");
      toast.error("Failed to send. Please try again or email me directly.");
    }
  }

  // ─── Success State ────────────────────────────────
  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-success/20 bg-success/[0.03] p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6"
        >
          <CheckCircle className="h-8 w-8 text-success" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
          Thanks for reaching out! I&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="outline"
          onClick={() => setState("idle")}
          className="rounded-xl"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Server error banner */}
      <AnimatePresence mode="wait">
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2.5 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Something went wrong. Please try again or email me directly.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingField
          id="name"
          label="Your Name"
          value={formData.name}
          onChange={(v) => updateField("name", v)}
          error={errors.name}
          required
        />
        <FloatingField
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(v) => updateField("email", v)}
          error={errors.email}
          required
        />
      </div>

      {/* Subject */}
      <FloatingField
        id="subject"
        label="Subject"
        value={formData.subject || ""}
        onChange={(v) => updateField("subject", v)}
        error={errors.subject}
      />

      {/* Message */}
      <div className="space-y-1">
        <FloatingField
          id="message"
          label="Your Message"
          value={formData.message}
          onChange={(v) => updateField("message", v)}
          error={errors.message}
          required
          multiline
          rows={5}
          maxLength={5000}
        />
        <div className="flex justify-end px-1">
          <span className={cn(
            "text-[11px] transition-colors",
            formData.message.length > 4500
              ? "text-destructive"
              : "text-muted-foreground/50"
          )}>
            {formData.message.length}/5000
          </span>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={state === "loading"}
        className="w-full text-base py-6 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-glow hover:shadow-glow-secondary transition-all duration-300 group"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
