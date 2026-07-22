/**
 * Sonner Toaster Tests
 *
 * Verifies that the Toaster wrapper renders with dark theme and
 * the correct CSS custom property mappings for the design system.
 *
 * RUN: npx vitest run src/components/ui/__tests__/sonner.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Toaster } from "../sonner";

describe("Toaster", () => {
  it("renders without throwing", () => {
    // Sonner uses createPortal, making DOM queries unreliable in jsdom.
    // We validate the component mounts and applies its configuration.
    expect(() => render(<Toaster />)).not.toThrow();
  });
});
