/**
 * Progress Component Tests
 *
 * Verifies semantic token usage: bg-accent-engineering/15 (track)
 * and bg-accent-engineering (indicator/fill).
 *
 * RUN: npx vitest run src/components/ui/__tests__/progress.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "../progress";

/**
 * Helper: returns the root progress element by role.
 * Radix ProgressPrimitive renders with role="progressbar".
 */
function getRoot(container: HTMLElement) {
  return container.querySelector('[role="progressbar"]')!;
}

/**
 * Helper: returns the indicator element by data-slot.
 */
function getIndicator(container: HTMLElement) {
  return container.querySelector('[data-slot="progress-indicator"]')!;
}

describe("Progress — semantic tokens", () => {
  it("renders with bg-accent-engineering/15 track", () => {
    const { container } = render(<Progress value={50} />);
    const progress = getRoot(container);
    expect(progress).toBeInTheDocument();
    expect(progress.className).toContain("bg-accent-engineering/15");
    expect(progress.className).toContain("rounded-full");
  });

  it("renders indicator with bg-accent-engineering", () => {
    const { container } = render(<Progress value={50} />);
    const indicator = getIndicator(container);
    expect(indicator).toBeInTheDocument();
    expect(indicator.className).toContain("bg-accent-engineering");
  });

  it("translates indicator based on value", () => {
    const { container } = render(<Progress value={75} />);
    const indicator = getIndicator(container);
    expect((indicator as HTMLElement).style.transform).toBe("translateX(-25%)");
  });

  it("handles 0% value", () => {
    const { container } = render(<Progress value={0} />);
    const indicator = getIndicator(container);
    expect((indicator as HTMLElement).style.transform).toBe("translateX(-100%)");
  });

  it("handles 100% value", () => {
    const { container } = render(<Progress value={100} />);
    const indicator = getIndicator(container);
    // 100 - 100 = 0, CSS renders as "-0%" from the calc
    expect(["translateX(0%)", "translateX(-0%)"]).toContain(
      (indicator as HTMLElement).style.transform
    );
  });

  it("handles undefined value (falls back to 0)", () => {
    const { container } = render(<Progress />);
    const indicator = getIndicator(container);
    expect((indicator as HTMLElement).style.transform).toBe("translateX(-100%)");
  });

  it("has data-slot=\"progress\"", () => {
    const { container } = render(<Progress value={50} />);
    expect(getRoot(container)).toHaveAttribute("data-slot", "progress");
  });
});
