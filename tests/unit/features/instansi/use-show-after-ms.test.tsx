// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useShowAfterMs } from "@/features/instansi/invoices/hooks/use-show-after-ms";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("useShowAfterMs", () => {
  it("stays hidden while the work may still be running", () => {
    const { result } = renderHook(() => useShowAfterMs(true, 8000));

    act(() => {
      vi.advanceTimersByTime(7999);
    });

    expect(result.current).toBe(false);
  });

  it("shows once the delay has passed", () => {
    const { result } = renderHook(() => useShowAfterMs(true, 8000));

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(result.current).toBe(true);
  });

  it("resets when the work finishes", () => {
    const { result, rerender } = renderHook(
      ({ active }) => useShowAfterMs(active, 8000),
      { initialProps: { active: true } },
    );

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(result.current).toBe(true);

    rerender({ active: false });
    expect(result.current).toBe(false);
  });

  it("never shows while inactive", () => {
    const { result } = renderHook(() => useShowAfterMs(false, 8000));

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    expect(result.current).toBe(false);
  });
});
