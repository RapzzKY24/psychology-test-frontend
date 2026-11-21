/**
 * Shape of a TIMED_GRID result, kept out of the chart module: a `"use client"`
 * file turns every export into a client reference, and a server component may
 * not call one. The review page needs the guard on the server, the chart needs
 * the type on the client, so both read it from here.
 */

/** One lajur of the grid, as the scorer stores it. */
export interface TimedGridColumn {
  column: number;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  gaps: number;
}

export interface TimedGridMetric {
  label: string;
  value: number;
  band: string | null;
  group: string;
}

/** `scores` of a TIMED_GRID result. */
export interface TimedGridScores {
  total: number;
  gaps: number;
  correct: number;
  wrong: number;
  skipped: number;
  columns: TimedGridColumn[];
  curve: number[];
  metrics: Record<string, TimedGridMetric>;
}

/**
 * A result's `scores` are whatever the family wrote, so the page has to ask
 * before it draws. A curve of numbers and a per-lajur tally is the whole shape.
 */
export function isTimedGridScores(scores: unknown): scores is TimedGridScores {
  const value = scores as Partial<TimedGridScores> | undefined;
  return (
    Array.isArray(value?.curve) &&
    Array.isArray(value?.columns) &&
    typeof value?.metrics === "object" &&
    value?.metrics !== null
  );
}
