import { PATTERN_CODES } from "./constants";

export interface InterpretationDraft {
  patternCode: string;
  title: string;
  body: string;
}

/** Unfilled codes in natural order ('1'..'40') — matches the publish 422 payload. */
export function missingPatternCodes(interpretations: InterpretationDraft[]): string[] {
  const filled = new Set(interpretations.map((i) => i.patternCode));
  return PATTERN_CODES.filter((code) => !filled.has(code));
}

export interface InterpretationCoverage {
  filled: number;
  total: number;
  missing: number;
}

export function coverage(interpretations: InterpretationDraft[]): InterpretationCoverage {
  return {
    filled: interpretations.length,
    total: PATTERN_CODES.length,
    missing: PATTERN_CODES.length - interpretations.length,
  };
}
