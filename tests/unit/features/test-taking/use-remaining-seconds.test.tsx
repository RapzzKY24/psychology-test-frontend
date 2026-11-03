// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useRemainingSeconds } from "@/features/test-taking/hooks/use-remaining-seconds";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("useRemainingSeconds", () => {
  it("starts from the server number", () => {
    const { result } = renderHook(() => useRemainingSeconds(600));

    expect(result.current).toBe(600);
  });

  it("ticks down once a second", () => {
    const { result } = renderHook(() => useRemainingSeconds(600));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(597);
  });

  it("stops at zero instead of going negative", () => {
    const { result } = renderHook(() => useRemainingSeconds(2));

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current).toBe(0);
  });

  it("re-syncs when the server sends a fresh number", () => {
    const { result, rerender } = renderHook(({ seconds }) => useRemainingSeconds(seconds), {
      initialProps: { seconds: 600 },
    });

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe(540);

    rerender({ seconds: 120 });

    expect(result.current).toBe(120);
  });

  it("returns null for an untimed test", () => {
    const { result } = renderHook(() => useRemainingSeconds(null));

    expect(result.current).toBeNull();
  });
});
