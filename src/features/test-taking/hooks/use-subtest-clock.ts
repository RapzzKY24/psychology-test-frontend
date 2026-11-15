"use client";

import { useEffect, useState } from "react";
import type { AttemptRead, AttemptSubtest } from "@/lib/api/types";

export interface SubtestWindow {
  subtest: AttemptSubtest;
  index: number;
  /**
   * `memorize` is the printed word list before the window opens (ME only);
   * `answer` is the window itself.
   */
  phase: "memorize" | "answer";
  /** Seconds left in the current phase. */
  remainingSec: number;
}

export interface SubtestClock {
  /** Null once the last window has closed. */
  current: SubtestWindow | null;
  /** The battery ran out: there is nothing left to open. */
  finished: boolean;
}

/**
 * Where the participant is in the battery, derived from the server's clock.
 *
 * The payload carries `remainingSeconds`, not a start timestamp the browser
 * could trust, so the elapsed time is anchored once from
 * `timeLimitMin * 60 - remainingSeconds` and ticked locally. A refetch sends a
 * fresh number and re-anchors, exactly like the single-clock countdown.
 */
export function useSubtestClock(attempt: AttemptRead): SubtestClock {
  const subtests = attempt.subtests;
  const totalSec =
    attempt.timeLimitMin === null ? null : attempt.timeLimitMin * 60;
  const startElapsedSec =
    totalSec !== null && attempt.remainingSeconds !== null
      ? Math.max(0, totalSec - attempt.remainingSeconds)
      : 0;

  const [elapsedSec, setElapsedSec] = useState(startElapsedSec);

  // Adjusting state during render is the sanctioned way to react to a new prop:
  // a fresh payload restarts the clock from the server's number.
  const [anchor, setAnchor] = useState(startElapsedSec);
  if (startElapsedSec !== anchor) {
    setAnchor(startElapsedSec);
    setElapsedSec(startElapsedSec);
  }

  useEffect(() => {
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setElapsedSec(startElapsedSec + Math.round((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [startElapsedSec]);

  if (subtests.length === 0) return { current: null, finished: false };

  const index = subtests.findIndex(
    (subtest) => elapsedSec < subtest.startOffsetSec + subtest.durationSec,
  );

  if (index === -1) return { current: null, finished: true };

  const subtest = subtests[index]!;
  const beforeWindow = elapsedSec < subtest.startOffsetSec;
  const phase = beforeWindow ? "memorize" : "answer";
  const remainingSec = beforeWindow
    ? subtest.startOffsetSec - elapsedSec
    : subtest.startOffsetSec + subtest.durationSec - elapsedSec;

  return { current: { subtest, index, phase, remainingSec }, finished: false };
}
