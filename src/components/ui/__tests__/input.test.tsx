/**
 * Input Component Tests
 *
 * Verifies semantic token usage: border-input-border, bg-input-background,
 * border-input-focus for focus state, placeholder token.
 *
 * RUN: npx vitest run src/components/ui/__tests__/input.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input — semantic tokens", () => {
  it("renders with border-input-border", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("border-input-border");
    expect(input.className).toContain("bg-input-background");
  });

  it("has data-slot=\"input\"", () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("data-slot", "input");
  });

  it("renders with focus-visible border-input-focus class", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("focus-visible:border-input-focus");
  });

  it("renders placeholder with text-muted-foreground", () => {
    render(<Input data-testid="input" placeholder="Enter text..." />);
    expect(screen.getByTestId("input")).toHaveAttribute("placeholder", "Enter text...");
    expect(screen.getByTestId("input").className).toContain("placeholder:text-muted-foreground");
  });
});

describe("Input — interaction", () => {
  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
  });

  it("forwards the type prop", () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
  });

  it("respects the disabled prop", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  it("shows aria-invalid when invalid", () => {
    render(<Input aria-invalid={true} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toContain("aria-invalid:border-destructive");
  });

  it("respects readOnly prop", () => {
    render(<Input readOnly data-testid="input" value="Read" />);
    expect(screen.getByTestId("input")).toHaveAttribute("readOnly");
  });
});
