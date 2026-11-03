export const DISC_DIMENSIONS = ["D", "I", "S", "C", "*"] as const;

export type DiscDimension = (typeof DISC_DIMENSIONS)[number];

/** The 40 DISC pattern codes in natural (numeric) order — verified backend catalog. */
export const PATTERN_CODES: readonly string[] = Array.from({ length: 40 }, (_, i) => String(i + 1));

/**
 * Pattern codes of a pair instrument are assembled from its dimensions, so they
 * can only be known once the items exist. Mirror of the backend
 * `pairPatternCodes`: dimensions in first-appearance order, cartesian product.
 */
export function pairPatternCodes(contents: unknown[]): readonly string[] {
  const dimensions: [string, string][] = [];
  const seen = new Set<string>();
  for (const content of contents) {
    const mapping = (content as { mapping?: unknown } | undefined)?.mapping;
    if (!Array.isArray(mapping) || mapping.length !== 2) continue;
    const left = String(mapping[0] ?? "").trim().toUpperCase();
    const right = String(mapping[1] ?? "").trim().toUpperCase();
    if (!left || !right) continue;
    const key = [left, right].sort().join("");
    if (seen.has(key)) continue;
    seen.add(key);
    dimensions.push([left, right]);
  }

  if (dimensions.length === 0) return [];

  let codes = [""];
  for (const [left, right] of dimensions) {
    const next: string[] = [];
    for (const code of codes) {
      for (const pole of [left, right]) next.push(code + pole);
    }
    codes = next;
  }
  return codes;
}

export function getPatternCodes(
  scorerType: string,
  itemCount?: number,
  itemContents?: unknown[],
): readonly string[] {
  if (scorerType === "RIGHT_WRONG_NORM") {
    const total = typeof itemCount === "number" && itemCount > 0 ? itemCount : 20;
    return Array.from({ length: total + 1 }, (_, i) => `RAW_${i}`);
  }
  if (scorerType === "FORCED_CHOICE_PAIR") return pairPatternCodes(itemContents ?? []);
  return PATTERN_CODES;
}
