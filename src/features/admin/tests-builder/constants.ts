export const DISC_DIMENSIONS = ["D", "I", "S", "C", "*"] as const;

export type DiscDimension = (typeof DISC_DIMENSIONS)[number];

/** The 40 DISC pattern codes in natural (numeric) order — verified backend catalog. */
export const PATTERN_CODES: readonly string[] = Array.from({ length: 40 }, (_, i) => String(i + 1));
