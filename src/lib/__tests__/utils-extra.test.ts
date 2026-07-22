/**
 * Additional Utility Function Tests
 *
 * Covers the remaining uncovered functions from utils.ts:
 * parseJsonArray, stringifyJsonArray, debounce, isPresent, randomItem.
 *
 * RUN: npx vitest run src/lib/__tests__/utils-extra.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import {
  parseJsonArray,
  stringifyJsonArray,
  debounce,
  isPresent,
  randomItem,
} from "../utils";

// ─── parseJsonArray() tests ─────────────────────────

describe("parseJsonArray()", () => {
  it("parses a valid JSON array string", () => {
    expect(parseJsonArray('["a","b","c"]')).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for null input", () => {
    expect(parseJsonArray(null)).toEqual([]);
  });

  it("returns an empty array for undefined input", () => {
    expect(parseJsonArray(undefined)).toEqual([]);
  });

  it("returns an empty array for empty string", () => {
    expect(parseJsonArray("")).toEqual([]);
  });

  it("returns an empty array for invalid JSON", () => {
    expect(parseJsonArray("not-json")).toEqual([]);
  });

  it("returns an empty array for non-array JSON (object)", () => {
    expect(parseJsonArray('{"key":"value"}')).toEqual([]);
  });

  it("parses an array of numbers", () => {
    expect(parseJsonArray<number>("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  it("parses an array of objects", () => {
    const result = parseJsonArray<{ id: number }>('[{"id":1},{"id":2}]');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
  });
});

// ─── stringifyJsonArray() tests ─────────────────────

describe("stringifyJsonArray()", () => {
  it("stringifies an array of strings", () => {
    expect(stringifyJsonArray(["a", "b"])).toBe('["a","b"]');
  });

  it("stringifies an array of numbers", () => {
    expect(stringifyJsonArray([1, 2, 3])).toBe("[1,2,3]");
  });

  it("stringifies an empty array", () => {
    expect(stringifyJsonArray([])).toBe("[]");
  });

  it("stringifies an array of objects", () => {
    expect(stringifyJsonArray([{ id: 1 }])).toBe('[{"id":1}]');
  });
});

// ─── debounce() tests ───────────────────────────────

describe("debounce()", () => {
  it("delays function execution", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("cancels previous pending calls when called again", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200);

    debounced(); // reset timer
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled(); // first call was cancelled

    vi.advanceTimersByTime(100); // finish second call's timer
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("passes arguments to the debounced function", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("hello", 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("hello", 42);

    vi.useRealTimers();
  });

  it("handles multiple arguments correctly", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced("a", "b", "c");
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledWith("a", "b", "c");

    vi.useRealTimers();
  });
});

// ─── isPresent() extra tests ────────────────────────

describe("isPresent() — additional edge cases", () => {
  it("returns true for an empty object", () => {
    expect(isPresent({})).toBe(true);
  });

  it("returns true for an empty array", () => {
    expect(isPresent([])).toBe(true);
  });

  it("returns true for boolean false", () => {
    expect(isPresent(false)).toBe(true);
  });
});

// ─── randomItem() additional tests ──────────────────

describe("randomItem() — additional edge cases", () => {
  it("returns undefined for an empty array", () => {
    expect(randomItem([])).toBeUndefined();
  });
});
