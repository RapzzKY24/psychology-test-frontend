import { DEFAULT_RAW_ITEM_COUNT, PATTERN_CODES } from "./constants";

export interface InterpretationDraft {
  patternCode: string;
  title: string;
  body: string;
}

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
    const left = String(mapping[0] ?? "")
      .trim()
      .toUpperCase();
    const right = String(mapping[1] ?? "")
      .trim()
      .toUpperCase();
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

/**
 * Pattern codes of a tally instrument are the scales its items name — the
 * strongest scale becomes the code. Mirror of the backend `scaleTallyPatternCodes`.
 */
export function scaleTallyPatternCodes(contents: unknown[]): readonly string[] {
  const seen = new Set<string>();
  for (const content of contents) {
    const scale = (content as { scale?: unknown } | undefined)?.scale;
    if (typeof scale !== "string") continue;
    const code = scale.trim().toUpperCase();
    if (code) seen.add(code);
  }
  return [...seen];
}

/**
 * Pattern codes of a choice tally are the scales its option mappings name — the
 * scale that ends up ahead becomes the code. Mirror of the backend
 * `choiceTallyPatternCodes`.
 */
export function choiceTallyPatternCodes(contents: unknown[]): readonly string[] {
  const seen = new Set<string>();
  for (const content of contents) {
    const mapping = (content as { mapping?: unknown } | undefined)?.mapping;
    if (!Array.isArray(mapping)) continue;
    for (const scale of mapping) {
      if (typeof scale !== "string") continue;
      const code = scale.trim().toUpperCase();
      if (code) seen.add(code);
    }
  }
  return [...seen];
}

/**
 * Pattern codes of a pair tally are the scales its statement mappings name — the
 * scale picked most often becomes the code. Unlike `pairPatternCodes` there is
 * no cartesian product: every statement scores on its own. Mirror of the backend
 * `pairTallyScales`.
 */
export function pairTallyPatternCodes(contents: unknown[]): readonly string[] {
  const seen = new Set<string>();
  for (const content of contents) {
    const mapping = (content as { mapping?: unknown } | undefined)?.mapping;
    if (!Array.isArray(mapping)) continue;
    for (const scale of mapping) {
      if (typeof scale !== "string") continue;
      const code = scale.trim().toUpperCase();
      if (code) seen.add(code);
    }
  }
  return [...seen];
}

/** A band label becomes part of the pattern code: "Sangat Tinggi" -> "SANGAT_TINGGI". */
export function bandCode(label: string): string {
  return label
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Pattern codes of a Likert inventory: every scale crossed with every band the
 * test declares (`E_RENDAH` … `E_TINGGI`). Without bands the scale is the code.
 * Mirror of the backend `likertPatternCodes`.
 */
export function likertPatternCodes(
  contents: unknown[],
  scoringConfig?: unknown,
): readonly string[] {
  const scales = new Set<string>();
  for (const content of contents) {
    const scale = (content as { scale?: unknown } | undefined)?.scale;
    if (typeof scale !== "string") continue;
    const code = scale.trim().toUpperCase();
    if (code) scales.add(code);
  }

  const bands = (scoringConfig as { bands?: unknown } | undefined)?.bands;
  if (!Array.isArray(bands) || bands.length === 0) return [...scales];

  const codes: string[] = [];
  for (const scale of scales) {
    for (const band of bands) {
      const label = (band as { label?: unknown } | undefined)?.label;
      if (typeof label !== "string" || !label.trim()) continue;
      codes.push(`${scale}_${bandCode(label)}`);
    }
  }
  return codes;
}

/**
 * Codes a test must cover before publish: a raw score uses every RAW_n, DISC
 * uses 1..40, a pair instrument derives them from its item mappings.
 */
export function getPatternCodes(
  scorerType: string,
  itemCount?: number,
  itemContents?: unknown[],
  scoringConfig?: unknown,
): readonly string[] {
  if (scorerType === "RIGHT_WRONG_NORM") {
    const total =
      typeof itemCount === "number" && itemCount > 0 ? itemCount : DEFAULT_RAW_ITEM_COUNT;
    return Array.from({ length: total + 1 }, (_, i) => `RAW_${i}`);
  }
  if (scorerType === "FORCED_CHOICE_PAIR") return pairPatternCodes(itemContents ?? []);
  if (scorerType === "PAIR_TALLY") return pairTallyPatternCodes(itemContents ?? []);
  if (scorerType === "LIKERT") return likertPatternCodes(itemContents ?? [], scoringConfig);
  if (scorerType === "SCALE_TALLY") return scaleTallyPatternCodes(itemContents ?? []);
  if (scorerType === "CHOICE_TALLY") return choiceTallyPatternCodes(itemContents ?? []);
  return PATTERN_CODES;
}

/** A row counts as filled only when both title and body have content. */
export function isFilled(row: InterpretationDraft): boolean {
  return row.title.trim().length > 0 && row.body.trim().length > 0;
}

/**
 * The backend rejects a row whose title or body is empty, so a half-typed row
 * can never be stored. Splitting them out keeps the caller from silently
 * throwing that typing away.
 */
export function partitionInterpretations(rows: InterpretationDraft[]): {
  complete: InterpretationDraft[];
  partial: InterpretationDraft[];
} {
  const complete: InterpretationDraft[] = [];
  const partial: InterpretationDraft[] = [];
  for (const row of rows) {
    if (isFilled(row)) complete.push(row);
    else if (row.title.trim().length > 0 || row.body.trim().length > 0) partial.push(row);
  }
  return { complete, partial };
}

/** Unfilled codes in natural order — matches the publish 422 payload. */
export function missingPatternCodes(
  interpretations: InterpretationDraft[],
  scorerType = "FORCED_CHOICE_DISC",
  itemCount?: number,
  itemContents?: unknown[],
  scoringConfig?: unknown,
): string[] {
  const codes = getPatternCodes(scorerType, itemCount, itemContents, scoringConfig);
  const filled = new Set(interpretations.filter(isFilled).map((i) => i.patternCode));
  return (codes as readonly string[]).filter((code) => !filled.has(code));
}

export interface InterpretationCoverage {
  filled: number;
  total: number;
  missing: number;
}

export function coverage(
  interpretations: InterpretationDraft[],
  scorerType = "FORCED_CHOICE_DISC",
  itemCount?: number,
  itemContents?: unknown[],
  scoringConfig?: unknown,
): InterpretationCoverage {
  const codes = getPatternCodes(scorerType, itemCount, itemContents, scoringConfig);
  const missing = missingPatternCodes(
    interpretations,
    scorerType,
    itemCount,
    itemContents,
    scoringConfig,
  );
  return {
    filled: codes.length - missing.length,
    total: codes.length,
    missing: missing.length,
  };
}
