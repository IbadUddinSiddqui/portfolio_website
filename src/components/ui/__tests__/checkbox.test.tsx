/**
 * Checkbox Component Tests
 *
 * Verifies semantic token usage: border-input-border, bg-input-background,
 * bg-primary (checked), text-primary-foreground (checked icon).
 *
 * RUN: npx vitest run src/components/ui/__tests__/checkbox.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "../checkbox";

describe("Checkbox — semantic tokens", () => {
  it("renders with border-input-border and bg-input-background", () => {
    render(<Checkbox data-testid="checkbox" />);
    const cb = screen.getByTestId("checkbox");
    expect(cb).toBeInTheDocument();
    expect(cb.className).toContain("border-input-border");
    expect(cb.className).toContain("bg-input-background");
  });

  it("has data-slot=\"checkbox\"", () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toHaveAttribute("data-slot", "checkbox");
  });

  it("renders with focus-visible ring classes", () => {
    render(<Checkbox data-testid="checkbox" />);
    const cb = screen.getByTestId("checkbox");
    expect(cb.className).toContain("focus-visible:border-input-focus");
    expect(cb.className).toContain("focus-visible:ring-[3px]");
  });

  it("renders with aria-invalid classes when invalid", () => {
    render(<Checkbox data-testid="checkbox" aria-invalid={true} />);
    expect(screen.getByTestId("checkbox").className).toContain("aria-invalid:border-destructive");
  });

  it("supports the disabled prop", () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    expect(screen.getByTestId("checkbox")).toBeDisabled();
  });

  it("renders with data-[state=checked] classes for checked state", () => {
    render(<Checkbox data-testid="checkbox" defaultChecked />);
    const cb = screen.getByTestId("checkbox");
    expect(cb.className).toContain("data-[state=checked]:border-primary");
    expect(cb.className).toContain("data-[state=checked]:bg-primary");
  });
});
