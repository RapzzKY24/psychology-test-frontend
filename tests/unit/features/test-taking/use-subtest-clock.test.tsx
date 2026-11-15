// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useSubtestClock } from "@/features/test-taking/hooks/use-subtest-clock";
import type { AttemptRead } from "@/lib/api/types";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/**
 * SE runs 0–6', then ME memorises 6'–9' and answers 9'–12'. The whole battery
 * is 12 minutes, which is what `timeLimitMin` and `remainingSeconds` describe.
 */
function battery(remainingSeconds = 720): AttemptRead {
  return {
    id: "attempt-1",
    sessionId: "session-1",
    testId: "test-1",
    testName: "IST",
    scorerType: "MULTI_SUBTEST",
    status: "IN_PROGRESS",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
    timeLimitMin: 12,
    remainingSeconds,
    requiresGender: false,
    gender: null,
    requiresEducation: false,
    education: null,
    subtests: [
      {
        code: "SE",
        name: "Melengkapi kalimat",
        kind: "CHOICE",
        instruction: "…",
        itemFrom: 1,
        itemTo: 2,
        startOffsetSec: 0,
        durationSec: 360,
        memorizeSec: 0,
        memorizeList: [],
      },
      {
        code: "ME",
        name: "Mengingat kata",
        kind: "CHOICE",
        instruction: "…",
        itemFrom: 3,
        itemTo: 4,
        startOffsetSec: 540,
        durationSec: 180,
        memorizeSec: 180,
        memorizeList: [{ label: "BUNGA", words: ["SOKA", "LARAT"] }],
      },
    ],
    items: [
      { id: "i1", order: 1, content: {} },
      { id: "i2", order: 2, content: {} },
      { id: "i3", order: 3, content: {} },
      { id: "i4", order: 4, content: {} },
    ],
    responses: [],
  };
}

describe("useSubtestClock", () => {
  it("opens on the first subtest and counts its window down", () => {
    const { result } = renderHook(() => useSubtestClock(battery()));

    expect(result.current.current?.subtest.code).toBe("SE");
    expect(result.current.current?.phase).toBe("answer");
    expect(result.current.current?.remainingSec).toBe(360);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.current?.remainingSec).toBe(300);
  });

  it("closes a subtest at its own deadline, not at the battery's", () => {
    const { result } = renderHook(() => useSubtestClock(battery()));

    act(() => {
      vi.advanceTimersByTime(360_000);
    });

    // SE is over; ME is studying its word list, not answering yet.
    expect(result.current.current?.subtest.code).toBe("ME");
    expect(result.current.current?.phase).toBe("memorize");
    expect(result.current.current?.remainingSec).toBe(180);
  });

  it("opens the answer window once the word list closes", () => {
    const { result } = renderHook(() => useSubtestClock(battery()));

    act(() => {
      vi.advanceTimersByTime(540_000);
    });

    expect(result.current.current?.subtest.code).toBe("ME");
    expect(result.current.current?.phase).toBe("answer");
    expect(result.current.current?.remainingSec).toBe(180);
  });

  it("reports the battery finished when the last window closes", () => {
    const { result } = renderHook(() => useSubtestClock(battery()));

    act(() => {
      vi.advanceTimersByTime(720_000);
    });

    expect(result.current.finished).toBe(true);
    expect(result.current.current).toBeNull();
  });

  it("anchors on the server's remaining time instead of a local start", () => {
    // Half the battery is already gone, so the client must not start at SE.
    const { result } = renderHook(() => useSubtestClock(battery(360)));

    expect(result.current.current?.subtest.code).toBe("ME");
    expect(result.current.current?.phase).toBe("memorize");
  });
});
