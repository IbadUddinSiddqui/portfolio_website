/**
 * Separator Component Tests
 *
 * Verifies bg-border semantic token usage and orientation variants.
 *
 * RUN: npx vitest run src/components/ui/__tests__/separator.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "../separator";

describe("Separator — semantic tokens", () => {
  it("renders with bg-border token", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep).toBeInTheDocument();
    expect(sep.className).toContain("bg-border");
  });

  it("has data-slot=\"separator\"", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-slot", "separator");
  });

  it("renders horizontal by default", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("data-[orientation=horizontal]:h-px");
    expect(sep.className).toContain("data-[orientation=horizontal]:w-full");
  });

  it("renders vertical when orientation is vertical", () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("data-[orientation=vertical]:h-full");
    expect(sep.className).toContain("data-[orientation=vertical]:w-px");
  });

  it("is decorative by default", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-orientation", "horizontal");
  });
});
