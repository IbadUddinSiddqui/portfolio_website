/**
 * Textarea Component Tests
 *
 * Verifies semantic token usage: border-input-border, bg-input-background,
 * border-input-focus for focus state, placeholder token.
 *
 * RUN: npx vitest run src/components/ui/__tests__/textarea.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../textarea";

describe("Textarea — semantic tokens", () => {
  it("renders with border-input-border and bg-input-background", () => {
    render(<Textarea data-testid="textarea" />);
    const ta = screen.getByTestId("textarea");
    expect(ta.className).toContain("border-input-border");
    expect(ta.className).toContain("bg-input-background");
  });

  it("has data-slot=\"textarea\"", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("data-slot", "textarea");
  });

  it("renders with focus-visible border-input-focus class", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea").className).toContain("focus-visible:border-input-focus");
  });

  it("renders with placeholder styling", () => {
    render(<Textarea data-testid="textarea" placeholder="Enter text..." />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("placeholder", "Enter text...");
    expect(screen.getByTestId("textarea").className).toContain("placeholder:text-muted-foreground");
  });
});

describe("Textarea — interaction", () => {
  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="textarea" />);
    const ta = screen.getByTestId("textarea");
    await user.type(ta, "Hello world");
    expect(ta).toHaveValue("Hello world");
  });

  it("respects the disabled prop", () => {
    render(<Textarea disabled data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeDisabled();
  });

  it("shows aria-invalid when invalid", () => {
    render(<Textarea aria-invalid={true} data-testid="textarea" />);
    expect(screen.getByTestId("textarea").className).toContain("aria-invalid:border-destructive");
  });

  it("renders with default min-height", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea").className).toContain("min-h-16");
  });
});
