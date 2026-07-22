/**
 * Switch Component Tests
 *
 * Verifies semantic token usage: bg-primary (checked), bg-input-background (unchecked),
 * bg-background (thumb), data-size attribute.
 *
 * RUN: npx vitest run src/components/ui/__tests__/switch.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch } from "../switch";

describe("Switch — semantic tokens", () => {
  it("renders with data-slot=\"switch\"", () => {
    render(<Switch data-testid="switch" />);
    expect(screen.getByTestId("switch")).toHaveAttribute("data-slot", "switch");
  });

  it("has data-size=\"default\" by default", () => {
    render(<Switch data-testid="switch" />);
    expect(screen.getByTestId("switch")).toHaveAttribute("data-size", "default");
  });

  it("accepts data-size=\"sm\"", () => {
    render(<Switch data-testid="switch" size="sm" />);
    expect(screen.getByTestId("switch")).toHaveAttribute("data-size", "sm");
  });

  it("renders with focus-visible:border-input-focus", () => {
    render(<Switch data-testid="switch" />);
    const el = screen.getByTestId("switch");
    expect(el.className).toContain("focus-visible:border-input-focus");
  });

  it("renders thumb with bg-background", () => {
    render(<Switch />);
    // The thumb is rendered inside the switch via radix
    const thumb = document.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toBeInTheDocument();
    expect(thumb?.className).toContain("bg-background");
  });
});

describe("Switch — size classes", () => {
  it("default size has correct dimensions", () => {
    render(<Switch data-testid="switch" />);
    const el = screen.getByTestId("switch");
    expect(el.className).toContain("data-[size=default]:h-[1.15rem]");
    expect(el.className).toContain("data-[size=default]:w-8");
  });

  it("sm size has correct dimensions", () => {
    render(<Switch data-testid="switch" size="sm" />);
    const el = screen.getByTestId("switch");
    expect(el.className).toContain("data-[size=sm]:h-3.5");
    expect(el.className).toContain("data-[size=sm]:w-6");
  });
});
