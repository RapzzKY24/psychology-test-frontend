import { PATTERN_CODES } from "./constants";

export interface InterpretationDraft {
  patternCode: string;
  title: string;
  body: string;
}

/** A row counts as filled only when both title and body have content. */
export function isFilled(row: InterpretationDraft): boolean {
  return row.title.trim().length > 0 && row.body.trim().length > 0;
}

/** Unfilled codes in natural order ('1'..'40') — matches the publish 422 payload. */
export function missingPatternCodes(interpretations: InterpretationDraft[]): string[] {
  const filled = new Set(interpretations.filter(isFilled).map((i) => i.patternCode));
  return PATTERN_CODES.filter((code) => !filled.has(code));
}

export interface InterpretationCoverage {
  filled: number;
  total: number;
  missing: number;
}

export function coverage(interpretations: InterpretationDraft[]): InterpretationCoverage {
  const missing = missingPatternCodes(interpretations);
  return {
    filled: PATTERN_CODES.length - missing.length,
    total: PATTERN_CODES.length,
    missing: missing.length,
  };
}
