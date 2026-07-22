/**
 * Card Component Tests
 *
 * Verifies that the Card component and its sub-components (CardHeader,
 * CardTitle, CardDescription, CardContent, CardFooter) all use the
 * correct semantic design tokens.
 *
 * RUN: npx vitest run src/components/ui/__tests__/card.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";

describe("Card — semantic token classes", () => {
  it("renders with card-background and card-border tokens", () => {
    render(
      <Card data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("bg-card-background");
    expect(card.className).toContain("border-card-border");
    expect(card).toBeInTheDocument();
  });

  it("renders with rounded-xl and shadow-sm", () => {
    render(
      <Card data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("rounded-xl");
    expect(card.className).toContain("shadow-sm");
  });

  it("renders with text-card-foreground", () => {
    render(
      <Card data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("text-card-foreground");
  });

  it("accepts additional className via props", () => {
    render(
      <Card data-testid="card" className="custom-class">
        <CardContent>Content</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("custom-class");
  });
});

describe("CardHeader", () => {
  it("renders with the correct grid layout", () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );
    const header = screen.getByTestId("header");
    expect(header.className).toContain("grid");
    expect(header.className).toContain("items-start");
    expect(header.className).toContain("gap-2");
  });
});

describe("CardTitle", () => {
  it("renders the title text", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle data-testid="title">Test Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByTestId("title")).toHaveTextContent("Test Title");
    expect(screen.getByTestId("title").className).toContain("font-semibold");
  });
});

describe("CardDescription", () => {
  it("renders description with muted foreground token", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription data-testid="desc">Description text</CardDescription>
        </CardHeader>
      </Card>
    );
    const desc = screen.getByTestId("desc");
    expect(desc).toHaveTextContent("Description text");
    // Uses the text-muted-foreground semantic token
    expect(desc.className).toContain("text-muted-foreground");
  });
});

describe("CardContent", () => {
  it("renders content with correct padding", () => {
    render(
      <Card>
        <CardContent data-testid="content">Content here</CardContent>
      </Card>
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveTextContent("Content here");
    expect(content.className).toContain("px-6");
  });
});

describe("CardFooter", () => {
  it("renders with flex layout", () => {
    render(
      <Card>
        <CardFooter data-testid="footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    );
    const footer = screen.getByTestId("footer");
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("items-center");
  });
});

describe("Card — composition", () => {
  it("renders a full card with all sub-components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content area</p>
        </CardContent>
        <CardFooter>
          <span>Footer content</span>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card description")).toBeInTheDocument();
    expect(screen.getByText("Main content area")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });
});
