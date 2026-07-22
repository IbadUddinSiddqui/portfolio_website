/**
 * Badge Component Tests
 *
 * Verifies that the Badge component uses the correct semantic design tokens
 * for each variant (default, secondary, destructive, outline, ghost, link).
 *
 * RUN: npx vitest run src/components/ui/__tests__/badge.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge — default variant", () => {
  it("renders with bg-badge-primary and text-badge-primary-foreground", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-badge-primary");
    expect(badge.className).toContain("text-badge-primary-foreground");
  });
});

describe("Badge — secondary variant", () => {
  it("renders with bg-badge-secondary and text-badge-secondary-foreground", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge.className).toContain("bg-badge-secondary");
    expect(badge.className).toContain("text-badge-secondary-foreground");
  });
});

describe("Badge — destructive variant", () => {
  it("renders with bg-badge-destructive and text-badge-destructive-foreground", () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText("Destructive");
    expect(badge.className).toContain("bg-badge-destructive");
    expect(badge.className).toContain("text-badge-destructive-foreground");
  });
});

describe("Badge — outline variant", () => {
  it("renders with border-border and text-foreground", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("border-border");
    expect(badge.className).toContain("text-foreground");
  });
});

describe("Badge — ghost variant", () => {
  it("renders with hover:bg-accent and hover:text-accent-foreground", () => {
    render(<Badge variant="ghost">Ghost</Badge>);
    const badge = screen.getByText("Ghost");
    expect(badge.className).toContain("hover:bg-accent");
    expect(badge.className).toContain("hover:text-accent-foreground");
  });
});

describe("Badge — link variant", () => {
  it("renders with text-link token", () => {
    render(<Badge variant="link">Link</Badge>);
    const badge = screen.getByText("Link");
    expect(badge.className).toContain("text-link");
    expect(badge.className).toContain("underline-offset-4");
  });
});

describe("Badge — common attributes", () => {
  it("has data-slot=\"badge\"", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toHaveAttribute("data-slot", "badge");
  });

  it("accepts additional className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("custom-class");
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>
    );
    const link = screen.getByRole("link", { name: /link badge/i });
    expect(link).toBeInTheDocument();
    expect(link.className).toContain("bg-badge-primary");
  });
});
