/**
 * Alert Component Tests
 *
 * Verifies CVA variant classes and semantic token usage:
 * - default: bg-card-background, text-card-foreground
 * - destructive: bg-card-background, text-destructive
 * - AlertTitle, AlertDescription sub-components
 *
 * RUN: npx vitest run src/components/ui/__tests__/alert.test.tsx
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";

describe("Alert — default variant", () => {
  it("renders with bg-card-background and text-card-foreground", () => {
    render(<Alert data-testid="alert">Content</Alert>);
    const alert = screen.getByTestId("alert");
    expect(alert.className).toContain("bg-card-background");
    expect(alert.className).toContain("text-card-foreground");
  });

  it("has role=\"alert\"", () => {
    render(<Alert data-testid="alert">Content</Alert>);
    expect(screen.getByTestId("alert")).toHaveAttribute("role", "alert");
  });

  it("has data-slot=\"alert\"", () => {
    render(<Alert data-testid="alert">Content</Alert>);
    expect(screen.getByTestId("alert")).toHaveAttribute("data-slot", "alert");
  });
});

describe("Alert — destructive variant", () => {
  it("renders with text-destructive", () => {
    render(<Alert variant="destructive" data-testid="alert">Error</Alert>);
    const alert = screen.getByTestId("alert");
    expect(alert.className).toContain("bg-card-background");
    expect(alert.className).toContain("text-destructive");
  });
});

describe("AlertTitle", () => {
  it("renders title text", () => {
    render(
      <Alert>
        <AlertTitle data-testid="title">Warning</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("title")).toHaveTextContent("Warning");
  });

  it("has data-slot=\"alert-title\"", () => {
    render(
      <Alert>
        <AlertTitle data-testid="title">Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("title")).toHaveAttribute("data-slot", "alert-title");
  });
});

describe("AlertDescription", () => {
  it("renders description with text-muted-foreground", () => {
    render(
      <Alert>
        <AlertDescription data-testid="desc">Description text</AlertDescription>
      </Alert>
    );
    const desc = screen.getByTestId("desc");
    expect(desc).toHaveTextContent("Description text");
    expect(desc.className).toContain("text-muted-foreground");
  });

  it("has data-slot=\"alert-description\"", () => {
    render(
      <Alert>
        <AlertDescription data-testid="desc">Desc</AlertDescription>
      </Alert>
    );
    expect(screen.getByTestId("desc")).toHaveAttribute("data-slot", "alert-description");
  });
});

describe("Alert — composition", () => {
  it("renders alert with title and description together", () => {
    render(
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
