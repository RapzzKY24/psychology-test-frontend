import { getPatternCodes } from "./constants";

export interface InterpretationDraft {
  patternCode: string;
  title: string;
  body: string;
}

/** A row counts as filled only when both title and body have content. */
export function isFilled(row: InterpretationDraft): boolean {
  return row.title.trim().length > 0 && row.body.trim().length > 0;
}

/** Unfilled codes in natural order — matches the publish 422 payload. */
export function missingPatternCodes(
  interpretations: InterpretationDraft[],
  scorerType = "FORCED_CHOICE_DISC",
  itemCount?: number,
): string[] {
  const codes = getPatternCodes(scorerType, itemCount);
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
): InterpretationCoverage {
  const codes = getPatternCodes(scorerType, itemCount);
  const missing = missingPatternCodes(interpretations, scorerType, itemCount);
  return {
    filled: codes.length - missing.length,
    total: codes.length,
    missing: missing.length,
  };
}
