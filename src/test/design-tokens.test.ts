/**
 * Design Token Tests
 *
 * These tests verify that all CSS custom properties (design tokens) resolve
 * to the correct values. This catches regressions when tokens are renamed,
 * redefined, or accidentally overwritten.
 *
 * The expected values come from the brand-identity specification defined in
 * the design-system architecture (see ARCHITECTURE.md / globals.css).
 *
 * RUN: npx vitest run src/test/design-tokens.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";

// ─── Helpers ────────────────────────────────────────

interface CssTokenMap {
  [varName: string]: string;
}

/**
 * Parse CSS text and extract `--name: value` pairs from `:root { }` blocks.
 */
function extractRootVariables(css: string): CssTokenMap {
  const tokens: CssTokenMap = {};
  // Match :root { ... } or .dark { ... } blocks
  const blockRegex = /(?::root|\.dark)\s*\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(css)) !== null) {
    const block = match[1];
    const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let varMatch: RegExpExecArray | null;

    while ((varMatch = varRegex.exec(block)) !== null) {
      tokens[varMatch[1].trim()] = varMatch[2].trim();
    }
  }

  return tokens;
}

// ─── Load CSS once ──────────────────────────────────

let rootTokens: CssTokenMap;

beforeAll(() => {
  const cssPath = path.resolve(__dirname, "../../src/app/globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");
  rootTokens = extractRootVariables(css);
});

// ─── Tests ──────────────────────────────────────────

describe("Design Tokens — Background & Surface", () => {
  it("background is the correct near-black", () => {
    expect(rootTokens["background"]).toBe("#090B10");
  });

  it("background-secondary is the correct dark slate", () => {
    expect(rootTokens["background-secondary"]).toBe("#111827");
  });

  it("background-elevated is the correct mid-slate", () => {
    expect(rootTokens["background-elevated"]).toBe("#161F2F");
  });

  it("background-hover is the correct lighter slate", () => {
    expect(rootTokens["background-hover"]).toBe("#1E293B");
  });

  it("surface is the same as background-secondary", () => {
    expect(rootTokens["surface"]).toBe("#111827");
  });

  it("surface-secondary is the elevated card surface", () => {
    expect(rootTokens["surface-secondary"]).toBe("#161F2F");
  });

  it("card-background matches surface", () => {
    expect(rootTokens["card-background"]).toBe("#111827");
  });
});

describe("Design Tokens — Text Colors", () => {
  it("text-primary is the lightest foreground", () => {
    expect(rootTokens["text-primary"]).toBe("#F8FAFC");
  });

  it("text-secondary is the muted gray", () => {
    expect(rootTokens["text-secondary"]).toBe("#94A3B8");
  });

  it("text-muted is a darker muted gray", () => {
    expect(rootTokens["text-muted"]).toBe("#64748B");
  });

  it("text-disabled is the darkest readable gray", () => {
    expect(rootTokens["text-disabled"]).toBe("#475569");
  });
});

describe("Design Tokens — Brand Accents", () => {
  it("primary (Electric Cyan) is #38BDF8", () => {
    expect(rootTokens["primary"]).toBe("#38BDF8");
  });

  it("primary-foreground is near-black for contrast", () => {
    expect(rootTokens["primary-foreground"]).toBe("#090B10");
  });

  it("secondary (Engineering Blue) is #2563EB", () => {
    expect(rootTokens["secondary"]).toBe("#2563EB");
  });

  it("secondary-foreground is white for contrast", () => {
    expect(rootTokens["secondary-foreground"]).toBe("#FFFFFF");
  });

  it("accent (Innovation Purple) is #8B5CF6", () => {
    expect(rootTokens["accent"]).toBe("#8B5CF6");
  });

  it("accent-foreground is white for contrast", () => {
    expect(rootTokens["accent-foreground"]).toBe("#FFFFFF");
  });
});

describe("Design Tokens — Brand-Named Accents", () => {
  it("accent-ai is Electric Cyan #38BDF8", () => {
    expect(rootTokens["accent-ai"]).toBe("#38BDF8");
  });

  it("accent-ai-foreground is near-black", () => {
    expect(rootTokens["accent-ai-foreground"]).toBe("#090B10");
  });

  it("accent-engineering is Engineering Blue #2563EB", () => {
    expect(rootTokens["accent-engineering"]).toBe("#2563EB");
  });

  it("accent-engineering-foreground is white", () => {
    expect(rootTokens["accent-engineering-foreground"]).toBe("#FFFFFF");
  });

  it("accent-innovation is Innovation Purple #8B5CF6", () => {
    expect(rootTokens["accent-innovation"]).toBe("#8B5CF6");
  });

  it("accent-innovation-foreground is white", () => {
    expect(rootTokens["accent-innovation-foreground"]).toBe("#FFFFFF");
  });
});

describe("Design Tokens — Borders & Inputs", () => {
  it("border is the subtle dark border #1F2937", () => {
    expect(rootTokens["border"]).toBe("#1F2937");
  });

  it("border-focus is Electric Cyan", () => {
    expect(rootTokens["border-focus"]).toBe("#38BDF8");
  });

  it("input-border matches border", () => {
    expect(rootTokens["input-border"]).toBe("#1F2937");
  });

  it("input-focus is Electric Cyan", () => {
    expect(rootTokens["input-focus"]).toBe("#38BDF8");
  });

  it("ring is Electric Cyan", () => {
    expect(rootTokens["ring"]).toBe("#38BDF8");
  });
});

describe("Design Tokens — Button Colors", () => {
  it("button-primary is Electric Cyan", () => {
    expect(rootTokens["button-primary"]).toBe("#38BDF8");
  });

  it("button-primary-hover is a lighter cyan", () => {
    expect(rootTokens["button-primary-hover"]).toBe("#7DD3FC");
  });

  it("button-primary-foreground is near-black", () => {
    expect(rootTokens["button-primary-foreground"]).toBe("#090B10");
  });

  it("button-secondary has no background (transparent)", () => {
    expect(rootTokens["button-secondary"]).toBe("transparent");
  });

  it("button-secondary-foreground is the light foreground", () => {
    expect(rootTokens["button-secondary-foreground"]).toBe("#F8FAFC");
  });
});

describe("Design Tokens — Badge Colors", () => {
  it("badge-primary is Electric Cyan", () => {
    expect(rootTokens["badge-primary"]).toBe("#38BDF8");
  });

  it("badge-primary-foreground is near-black", () => {
    expect(rootTokens["badge-primary-foreground"]).toBe("#090B10");
  });

  it("badge-secondary is Engineering Blue", () => {
    expect(rootTokens["badge-secondary"]).toBe("#2563EB");
  });

  it("badge-secondary-foreground is white", () => {
    expect(rootTokens["badge-secondary-foreground"]).toBe("#FFFFFF");
  });

  it("badge-destructive-foreground is white", () => {
    expect(rootTokens["badge-destructive-foreground"]).toBe("#FFFFFF");
  });
});

describe("Design Tokens — Status Colors", () => {
  it("success is #22C55E", () => {
    expect(rootTokens["success"]).toBe("#22C55E");
  });

  it("warning is #F59E0B", () => {
    expect(rootTokens["warning"]).toBe("#F59E0B");
  });

  it("error is #EF4444", () => {
    expect(rootTokens["error"]).toBe("#EF4444");
  });

  it("info is Electric Cyan", () => {
    expect(rootTokens["info"]).toBe("#38BDF8");
  });
});

describe("Design Tokens — Navbar", () => {
  it("navbar-active is Electric Cyan", () => {
    expect(rootTokens["navbar-active"]).toBe("#38BDF8");
  });

  it("navbar-background is a semi-transparent near-black", () => {
    expect(rootTokens["navbar-background"]).toBe("rgba(9,11,16,0.8)");
  });
});

describe("Design Tokens — Hero", () => {
  it("hero-bg matches the page background", () => {
    expect(rootTokens["hero-bg"]).toBe("#090B10");
  });

  it("hero-highlight is Electric Cyan", () => {
    expect(rootTokens["hero-highlight"]).toBe("#38BDF8");
  });
});

describe("Design Tokens — Particle System", () => {
  it("particle-primary is Electric Cyan", () => {
    expect(rootTokens["particle-primary"]).toBe("#38BDF8");
  });

  it("particle-secondary is Engineering Blue", () => {
    expect(rootTokens["particle-secondary"]).toBe("#2563EB");
  });

  it("particle-tertiary is Innovation Purple", () => {
    expect(rootTokens["particle-tertiary"]).toBe("#8B5CF6");
  });
});

describe("Design Tokens — Links", () => {
  it("link is Electric Cyan", () => {
    expect(rootTokens["link"]).toBe("#38BDF8");
  });

  it("link-hover is lighter cyan", () => {
    expect(rootTokens["link-hover"]).toBe("#7DD3FC");
  });
});
