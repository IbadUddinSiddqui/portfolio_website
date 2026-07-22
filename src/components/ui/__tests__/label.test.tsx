/**
 * Label Component Tests
 *
 * Verifies correct rendering, data-slot attribute, and peer-disabled styling.
 *
 * RUN: npx vitest run src/components/ui/__tests__/label.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  it("renders with text content", () => {
    render(<Label data-testid="label">Username</Label>);
    expect(screen.getByTestId("label")).toHaveTextContent("Username");
  });

  it("has data-slot=\"label\"", () => {
    render(<Label data-testid="label">Label</Label>);
    expect(screen.getByTestId("label")).toHaveAttribute("data-slot", "label");
  });

  it("has font-medium and leading-none classes", () => {
    render(<Label data-testid="label">Label</Label>);
    const label = screen.getByTestId("label");
    expect(label.className).toContain("font-medium");
    expect(label.className).toContain("leading-none");
  });

  it("accepts custom className", () => {
    render(<Label data-testid="label" className="custom-class">Label</Label>);
    expect(screen.getByTestId("label").className).toContain("custom-class");
  });

  it("renders with peer-disabled styling", () => {
    render(<Label data-testid="label">Label</Label>);
    const label = screen.getByTestId("label");
    expect(label.className).toContain("peer-disabled:cursor-not-allowed");
    expect(label.className).toContain("peer-disabled:opacity-50");
  });

  it("renders with htmlFor attribute", () => {
    render(<Label data-testid="label" htmlFor="email">Email</Label>);
    expect(screen.getByTestId("label")).toHaveAttribute("for", "email");
  });
});
