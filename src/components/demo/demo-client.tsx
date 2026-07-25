"use client";

import { useState, useCallback } from "react";
import type { BusinessPreset } from "@/types/preset";
import type { IndustryTheme } from "@/theme/theme.types";
import { presets } from "@/data/presets";
import { getThemeById } from "@/theme";
import { DemoPreview } from "./demo-preview";
import { DemoSwitcher } from "./demo-switcher";
import { DemoCustomForm } from "./demo-custom-form";
import { motion, AnimatePresence } from "motion/react";

/**
 * DemoClient
 *
 * Manages the active preset state, switching, and custom mode.
 * Renders the switcher controls above the live preview.
 */
export function DemoClient() {
  const [activePreset, setActivePreset] = useState<BusinessPreset>(presets[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customPreset, setCustomPreset] = useState<BusinessPreset | null>(null);

  const handlePresetChange = useCallback((preset: BusinessPreset) => {
    setIsCustomMode(false);
    setCustomPreset(null);
    setActivePreset(preset);
  }, []);

  const handleCustomChange = useCallback(
    (overrides: Partial<BusinessPreset>) => {
      setIsCustomMode(true);
      setCustomPreset((prev) => {
        const base = prev || activePreset;
        return {
          ...base,
          ...overrides,
          id: "custom",
          industryLabel: "Custom",
          isSampleContent: true,
        };
      });
    },
    [activePreset]
  );

  const displayPreset = isCustomMode && customPreset ? customPreset : activePreset;

  /** Look up the matching theme for the active preset */
  const activeTheme: IndustryTheme | undefined = getThemeById(displayPreset.themeId);

  const handleBackToPreset = useCallback(() => {
    setIsCustomMode(false);
    setCustomPreset(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Switcher Bar ─────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <DemoSwitcher
              presets={presets}
              activeId={displayPreset.id}
              onSelect={handlePresetChange}
              isCustomMode={isCustomMode}
              onCustomMode={() => setIsCustomMode(true)}
            />

            {isCustomMode && (
              <button
                onClick={handleBackToPreset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                ← Back to presets
              </button>
            )}
          </div>

          {/* Custom form appears below the switcher when in custom mode */}
          <AnimatePresence>
            {isCustomMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2">
                  <DemoCustomForm
                    preset={activePreset}
                    onChange={handleCustomChange}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Demo Preview ─────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={displayPreset.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0, 1] }}
        >
          <DemoPreview preset={displayPreset} theme={activeTheme} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
