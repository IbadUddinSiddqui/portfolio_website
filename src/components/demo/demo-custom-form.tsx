"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { BusinessPreset } from "@/types/preset";
import { cn } from "@/lib/utils";

interface DemoCustomFormProps {
  preset: BusinessPreset;
  onChange: (overrides: Partial<BusinessPreset>) => void;
}

const PRESET_COLORS = [
  { label: "Sky", value: "#0EA5E9" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Red", value: "#EF4444" },
  { label: "Emerald", value: "#10B981" },
  { label: "Violet", value: "#8B5CF6" },
  { label: "Rose", value: "#F43F5E" },
];

/**
 * DemoCustomForm
 *
 * Inline form that updates the preview live (debounced ~200ms).
 * Uses refs to avoid stale closures — the debounced callback always
 * reads the latest input values.
 * Falls back to base preset if fields are left empty.
 */
export function DemoCustomForm({ preset, onChange }: DemoCustomFormProps) {
  const [businessName, setBusinessName] = useState(preset.businessName);
  const [tagline, setTagline] = useState(preset.tagline);
  const [phone, setPhone] = useState(preset.phone);
  const [primaryColor, setPrimaryColor] = useState(preset.primaryColor);

  // Keep latest values in refs so the debounced callback always has fresh data
  const latestRef = useRef({ businessName, tagline, phone, primaryColor });
  latestRef.current = { businessName, tagline, phone, primaryColor };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Flush updates to parent in a single debounced call
  const scheduleEmit = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const { businessName, tagline, phone, primaryColor } = latestRef.current;
      onChange({
        businessName: businessName || preset.businessName,
        tagline: tagline || preset.tagline,
        phone: phone || preset.phone,
        primaryColor,
      });
    }, 200);
  }, [onChange, preset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBusinessName(e.target.value);
      scheduleEmit();
    },
    [scheduleEmit]
  );

  const handleTaglineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagline(e.target.value);
      scheduleEmit();
    },
    [scheduleEmit]
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(e.target.value);
      scheduleEmit();
    },
    [scheduleEmit]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setPrimaryColor(color);
      scheduleEmit();
    },
    [scheduleEmit]
  );

  return (
    <div className="rounded-xl border border-border/40 bg-card-background/40 p-4 md:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Business Name */}
        <div>
          <label
            htmlFor="demo-business-name"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Business Name
          </label>
          <input
            id="demo-business-name"
            type="text"
            value={businessName}
            onChange={handleNameChange}
            placeholder={preset.businessName}
            className={cn(
              "w-full px-3 py-2 rounded-lg text-sm bg-background border border-border/50",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
              "placeholder:text-muted-foreground/40 transition-all duration-200"
            )}
          />
        </div>

        {/* Tagline */}
        <div>
          <label
            htmlFor="demo-tagline"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Tagline
          </label>
          <input
            id="demo-tagline"
            type="text"
            value={tagline}
            onChange={handleTaglineChange}
            placeholder={preset.tagline}
            className={cn(
              "w-full px-3 py-2 rounded-lg text-sm bg-background border border-border/50",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
              "placeholder:text-muted-foreground/40 transition-all duration-200"
            )}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="demo-phone"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Phone
          </label>
          <input
            id="demo-phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={preset.phone}
            className={cn(
              "w-full px-3 py-2 rounded-lg text-sm bg-background border border-border/50",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
              "placeholder:text-muted-foreground/40 transition-all duration-200"
            )}
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Accent Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => handleColorChange(c.value)}
                title={c.label}
                className={cn(
                  "w-7 h-7 rounded-full transition-all duration-200 border-2",
                  primaryColor === c.value
                    ? "border-foreground scale-110 shadow-sm"
                    : "border-transparent hover:scale-110"
                )}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 mt-3">
        Services, testimonials, and pricing are inherited from the base preset
        (currently: <span className="font-medium text-foreground/70">{preset.industryLabel}</span>
        ). Fields left empty fall back to the base preset values.
      </p>
    </div>
  );
}
