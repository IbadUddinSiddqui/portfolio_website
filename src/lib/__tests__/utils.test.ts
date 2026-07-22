/**
 * Utility Function Tests
 *
 * Tests for the shared utility functions in src/lib/utils.ts.
 * These are foundational helpers used across the entire codebase.
 *
 * RUN: npx vitest run src/lib/__tests__/utils.test.ts
 */

import { describe, it, expect } from "vitest";
import { cn, slugify, truncate, formatDate, isPresent, randomItem } from "../utils";

// ─── cn() tests ─────────────────────────────────────

describe("cn() — class name merger", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null, 0 && "baz", "qux")).toBe("foo qux");
  });

  it("handles conditional objects", () => {
    const result = cn("base", { active: true, hidden: false });
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
  });

  it("resolves Tailwind conflicts via twMerge", () => {
    // twMerge should keep the last conflicting utility
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("resolves complex conflicts like padding", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
    expect(cn("p-4", "px-6")).toBe("p-4 px-6");
  });

  it("handles empty inputs gracefully", () => {
    expect(cn()).toBe("");
  });

  it("preserves non-conflicting classes", () => {
    const result = cn("text-red-500", "bg-blue-500", "p-4");
    expect(result).toBe("text-red-500 bg-blue-500 p-4");
  });
});

// ─── slugify() tests ───────────────────────────────

describe("slugify()", () => {
  it("converts a simple string to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World #2024")).toBe("hello-world-2024");
  });

  it("replaces underscores with hyphens", () => {
    expect(slugify("hello_world_test")).toBe("hello-world-test");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--hello-world--")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles strings with multiple spaces", () => {
    expect(slugify("hello    world")).toBe("hello-world");
  });
});

// ─── truncate() tests ─────────────────────────────

describe("truncate()", () => {
  it("returns the full text if it fits within the length", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates with ellipsis when text exceeds length", () => {
    expect(truncate("Hello World This Is Long", 10)).toMatch(/\.\.\.$/);
    expect(truncate("Hello World This Is Long", 10).length).toBeLessThanOrEqual(14);
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("handles edge case where length is 0", () => {
    expect(truncate("Hello", 0)).toBe("...");
  });
});

// ─── formatDate() tests ─────────────────────────────

describe("formatDate()", () => {
  it("formats a date string correctly", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats a Date object correctly", () => {
    const result = formatDate(new Date(2024, 0, 15)); // Jan 15, 2024
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("accepts custom month option", () => {
    const result = formatDate("2024-01-15", { year: "numeric", month: "short" });
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });
});

// ─── isPresent() tests ────────────────────────────

describe("isPresent()", () => {
  it("returns true for a string", () => {
    expect(isPresent("hello")).toBe(true);
  });

  it("returns false for null", () => {
    expect(isPresent(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPresent(undefined)).toBe(false);
  });

  it("returns true for a number (including 0)", () => {
    expect(isPresent(0)).toBe(true);
  });

  it("returns true for an empty string", () => {
    expect(isPresent("")).toBe(true);
  });
});

// ─── randomItem() tests ──────────────────────────

describe("randomItem()", () => {
  it("returns an item from the array", () => {
    const items = ["a", "b", "c"];
    const result = randomItem(items);
    expect(items).toContain(result);
  });

  it("always returns the only item in a single-item array", () => {
    expect(randomItem(["only"])).toBe("only");
  });

  it("returns different items given enough calls", () => {
    const items = [1, 2, 3, 4, 5];
    const results = new Set(Array.from({ length: 100 }, () => randomItem(items)));
    // With enough draws, we should see at least 3 different values
    expect(results.size).toBeGreaterThanOrEqual(3);
  });
});
