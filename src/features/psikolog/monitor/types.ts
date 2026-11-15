/** One day of the psychologist's incoming-review chart. */
export interface ReviewStatsPoint {
  /** `YYYY-MM-DD` in Asia/Jakarta. */
  date: string;
  count: number;
}

/** Counters behind the psychologist overview cards. */
export interface ReviewStats {
  incoming: ReviewStatsPoint[];
  mine: { approved7d: number; returned7d: number };
  queueNow: number;
}
