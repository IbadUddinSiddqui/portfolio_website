"use client";

import type { ReactNode } from "react";

/**
 * ThemeProvider
 *
 * Simplified — site is permanently dark themed, matching the hero section.
 * The `dark` class is set directly on the <html> element in layout.tsx.
 * This wrapper is kept as a minimal provider for component compatibility.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
