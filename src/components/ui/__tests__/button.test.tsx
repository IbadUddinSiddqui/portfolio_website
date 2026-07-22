/**
 * Button Component Tests
 *
 * Verifies that the Button component:
 * - Renders with correct semantic token classes for each variant
 * - Supports all size variants
 * - Handles the asChild prop via Slot
 * - Uses proper CVA variant classes
 *
 * RUN: npx vitest run src/components/ui/__tests__/button.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button — semantic token usage", () => {
  it("renders with default variant classes", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    // Default variant uses button-primary token classes
    expect(button.className).toContain("bg-button-primary");
    expect(button.className).toContain("text-button-primary-foreground");
  });

  it("renders with destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button.className).toContain("bg-destructive");
    expect(button.className).toContain("text-white");
  });

  it("renders with outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button", { name: /outline/i });
    expect(button.className).toContain("border-border");
    expect(button.className).toContain("bg-background");
  });

  it("renders with secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button.className).toContain("bg-button-secondary");
    expect(button.className).toContain("text-button-secondary-foreground");
    expect(button.className).toContain("border-border");
  });

  it("renders with ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button", { name: /ghost/i });
    expect(button.className).toContain("hover:bg-accent");
    expect(button.className).toContain("hover:text-accent-foreground");
  });

  it("renders with link variant classes", () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole("button", { name: /link/i });
    expect(button.className).toContain("text-primary");
    expect(button.className).toContain("underline-offset-4");
  });
});

describe("Button — size variants", () => {
  it("renders with default size", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: /default/i });
    expect(button.className).toContain("h-9");
    expect(button.className).toContain("px-4");
    expect(button.className).toContain("py-2");
  });

  it("renders with sm size", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button", { name: /small/i });
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("px-3");
  });

  it("renders with lg size", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button", { name: /large/i });
    expect(button.className).toContain("h-10");
    expect(button.className).toContain("px-6");
  });

  it("renders with icon size", () => {
    render(<Button size="icon" aria-label="Icon button">🔍</Button>);
    const button = screen.getByRole("button", { name: /icon button/i });
    expect(button.className).toContain("size-9");
  });
});

describe("Button — interaction", () => {
  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(clicked).toBe(true);
  });

  it("respects the disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    // Should render as an <a> tag with button classes
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link.className).toContain("bg-button-primary");
  });
});

describe("Button — data attributes", () => {
  it("has data-slot=\"button\"", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("has data-variant attribute", () => {
    render(<Button variant="destructive">Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "destructive");
  });
});
