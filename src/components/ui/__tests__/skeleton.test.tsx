/**
 * Skeleton Component Tests
 *
 * Verifies bg-muted semantic token usage and data-slot attribute.
 *
 * RUN: npx vitest run src/components/ui/__tests__/skeleton.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("renders with bg-muted token", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain("bg-muted");
  });

  it("renders with animate-pulse", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain("animate-pulse");
  });

  it("renders with rounded-md", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").className).toContain("rounded-md");
  });

  it("has data-slot=\"skeleton\"", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-slot", "skeleton");
  });

  it("accepts custom className", () => {
    render(<Skeleton data-testid="skeleton" className="h-10 w-full" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("h-10");
    expect(skeleton.className).toContain("w-full");
  });
});
