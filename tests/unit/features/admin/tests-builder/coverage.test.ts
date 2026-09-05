import { describe, expect, it } from "vitest";
import { PATTERN_CODES } from "@/features/admin/tests-builder/constants";
import {
  coverage,
  missingPatternCodes,
} from "@/features/admin/tests-builder/coverage";

describe("PATTERN_CODES", () => {
  it("lists the 40 DISC pattern codes in natural order", () => {
    expect(PATTERN_CODES).toHaveLength(40);
    expect(PATTERN_CODES[0]).toBe("1");
    expect(PATTERN_CODES[39]).toBe("40");
  });
});

describe("missingPatternCodes", () => {
  it("returns every code when nothing is filled", () => {
    expect(missingPatternCodes([])).toHaveLength(40);
  });

  it("returns unfilled codes in natural order (not lexicographic)", () => {
    const missing = missingPatternCodes([
      { patternCode: "1", title: "a", body: "x" },
      { patternCode: "2", title: "b", body: "x" },
      { patternCode: "40", title: "c", body: "x" },
    ]);
    expect(missing[0]).toBe("3");
    expect(missing).not.toContain("1");
    expect(missing).not.toContain("40");
    expect(missing).toHaveLength(37);
  });
});

describe("coverage", () => {
  it("counts filled against the 40-pattern catalog", () => {
    const result = coverage([
      { patternCode: "1", title: "a", body: "x" },
      { patternCode: "2", title: "b", body: "x" },
    ]);
    expect(result).toEqual({ filled: 2, total: 40, missing: 38 });
  });
});
