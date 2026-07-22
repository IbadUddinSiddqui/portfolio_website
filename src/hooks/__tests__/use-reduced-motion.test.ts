/**
 * useReducedMotion Hook Tests
 *
 * Verifies that the hook correctly detects the prefers-reduced-motion
 * media query and responds to changes.
 *
 * RUN: npx vitest run src/hooks/__tests__/use-reduced-motion.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "../use-reduced-motion";

describe("useReducedMotion", () => {
  beforeEach(() => {
    // Clear all matchMedia implementations
    vi.restoreAllMocks();
  });

  it("returns false when prefers-reduced-motion is not set", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion: reduce is set", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("responds to media query changes", () => {
    const listeners: Array<(event: { matches: boolean }) => void> = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_event: string, handler: (event: { matches: boolean }) => void) => {
        listeners.push(handler);
      },
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate the media query changing to 'reduce'
    act(() => {
      listeners.forEach((handler) => handler({ matches: true }));
    });
    expect(result.current).toBe(true);

    // Simulate changing back
    act(() => {
      listeners.forEach((handler) => handler({ matches: false }));
    });
    expect(result.current).toBe(false);
  });

  it("queries the correct media query string", () => {
    const matchMediaSpy = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = matchMediaSpy;

    renderHook(() => useReducedMotion());
    expect(matchMediaSpy).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("cleans up the event listener on unmount", () => {
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener,
    }));

    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
