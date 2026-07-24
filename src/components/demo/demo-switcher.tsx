"use client";

import type { BusinessPreset } from "@/types/preset";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DemoSwitcherProps {
  presets: BusinessPreset[];
  activeId: string;
  onSelect: (preset: BusinessPreset) => void;
  isCustomMode: boolean;
  onCustomMode: () => void;
}

/**
 * DemoSwitcher
 *
 * Pill/segmented button row — one per preset, plus a "Custom" mode button.
 * Clicking a pill instantly switches the preview below.
 */
export function DemoSwitcher({
  presets,
  activeId,
  onSelect,
  isCustomMode,
  onCustomMode,
}: DemoSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Industry presets">
      {presets.map((preset) => {
        const isActive = activeId === preset.id && !isCustomMode;
        return (
          <button
            key={preset.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(preset)}
            className={cn(
              "relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
              isActive
                ? "text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-secondary/60"
            )}
            style={
              isActive
                ? {
                    backgroundColor: preset.primaryColor,
                    boxShadow: `0 0 12px ${preset.primaryColor}40`,
                  }
                : undefined
            }
          >
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: isActive
                    ? "rgba(9, 11, 16, 0.6)"
                    : preset.primaryColor,
                  boxShadow: !isActive
                    ? `0 0 6px ${preset.primaryColor}60`
                    : undefined,
                }}
              />
              {preset.industryLabel}
            </span>
          </button>
        );
      })}

      {/* Custom mode button */}
      <button
        role="tab"
        aria-selected={isCustomMode}
        onClick={onCustomMode}
        className={cn(
          "relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border border-dashed",
          isCustomMode
            ? "border-primary/60 text-primary bg-primary/10"
            : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
        )}
      >
        <span className="flex items-center gap-1.5">
          <Plus className="h-3 w-3" />
          Custom
        </span>
      </button>
    </div>
  );
}
