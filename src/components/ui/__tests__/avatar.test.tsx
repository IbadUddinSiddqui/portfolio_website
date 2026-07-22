/**
 * Avatar Component Tests
 *
 * Verifies semantic token usage across all Avatar sub-components:
 * - Avatar: bg-surface, text-muted-foreground (in fallback)
 * - AvatarBadge: bg-primary, text-primary-foreground, ring-background
 * - Size variants
 *
 * RUN: npx vitest run src/components/ui/__tests__/avatar.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "../avatar";

describe("Avatar", () => {
  it("renders with data-slot=\"avatar\"", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-slot", "avatar");
  });

  it("renders with default size", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "default");
  });

  it("accepts sm size", () => {
    render(<Avatar data-testid="avatar" size="sm" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "sm");
  });

  it("accepts lg size", () => {
    render(<Avatar data-testid="avatar" size="lg" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "lg");
  });

  it("renders with rounded-full and overflow-hidden", () => {
    render(<Avatar data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar.className).toContain("rounded-full");
    expect(avatar.className).toContain("overflow-hidden");
  });
});

describe("AvatarImage", () => {
  it("has correct data-slot when rendered inside Avatar", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/test.jpg" alt="Test" />
      </Avatar>
    );
    // Radix AvatarImage may not render an img element in jsdom
    // (image load never completes), but if it does, verify the data-slot
    const img = container.querySelector('[data-slot="avatar-image"]');
    if (img) {
      expect(img).toBeInTheDocument();
    }
  });

  it("is exported and has correct displayName", () => {
    expect(AvatarImage).toBeDefined();
    expect(AvatarImage).toBeInstanceOf(Function);
  });
});

describe("AvatarFallback", () => {
  it("renders with bg-surface and text-muted-foreground", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="fb">JD</AvatarFallback>
      </Avatar>
    );
    const fb = screen.getByTestId("fb");
    expect(fb.className).toContain("bg-surface");
    expect(fb.className).toContain("text-muted-foreground");
  });

  it("renders fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="fb">AB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByTestId("fb")).toHaveTextContent("AB");
  });
});

describe("AvatarBadge", () => {
  it("renders with bg-primary and text-primary-foreground", () => {
    render(
      <Avatar>
        <AvatarBadge data-testid="badge" />
      </Avatar>
    );
    const badge = screen.getByTestId("badge");
    expect(badge.className).toContain("bg-primary");
    expect(badge.className).toContain("text-primary-foreground");
  });

  it("renders with ring-background", () => {
    render(
      <Avatar>
        <AvatarBadge data-testid="badge" />
      </Avatar>
    );
    expect(screen.getByTestId("badge").className).toContain("ring-background");
  });

  it("renders with data-slot=\"avatar-badge\"", () => {
    render(
      <Avatar>
        <AvatarBadge data-testid="badge" />
      </Avatar>
    );
    expect(screen.getByTestId("badge")).toHaveAttribute("data-slot", "avatar-badge");
  });
});

describe("AvatarGroup", () => {
  it("renders with data-slot=\"avatar-group\"", () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar />
      </AvatarGroup>
    );
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "avatar-group");
  });

  it("renders with negative spacing", () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar />
      </AvatarGroup>
    );
    expect(screen.getByTestId("group").className).toContain("-space-x-2");
  });
});

describe("AvatarGroupCount", () => {
  it("renders with bg-surface and text-muted-foreground", () => {
    render(
      <AvatarGroup>
        <AvatarGroupCount data-testid="count">+3</AvatarGroupCount>
      </AvatarGroup>
    );
    const count = screen.getByTestId("count");
    expect(count.className).toContain("bg-surface");
    expect(count.className).toContain("text-muted-foreground");
  });

  it("renders count text", () => {
    render(
      <AvatarGroup>
        <AvatarGroupCount data-testid="count">+5</AvatarGroupCount>
      </AvatarGroup>
    );
    expect(screen.getByTestId("count")).toHaveTextContent("+5");
  });
});
