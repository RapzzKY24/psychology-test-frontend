import { describe, expect, it } from "vitest";
import { PATTERN_CODES } from "@/features/admin/tests-builder/constants";
import {
  choiceTallyPatternCodes,
  coverage,
  missingPatternCodes,
  pairTallyPatternCodes,
  scaleTallyPatternCodes,
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

describe("scaleTallyPatternCodes", () => {
  it("collects the distinct scales in first-appearance order", () => {
    const contents = [
      { question: "a", options: ["Ya", "Tidak"], scale: "S" },
      { question: "b", options: ["Ya", "Tidak"], scale: "r" },
      { question: "c", options: ["Ya", "Tidak"], scale: "S" },
    ];
    expect(scaleTallyPatternCodes(contents)).toEqual(["S", "R"]);
  });

  it("ignores items without a scale", () => {
    expect(scaleTallyPatternCodes([{ question: "a" }, null])).toEqual([]);
  });

  it("drives the publish coverage of a tally test", () => {
    const contents = [
      { question: "a", options: ["Ya", "Tidak"], scale: "R" },
      { question: "b", options: ["Ya", "Tidak"], scale: "I" },
    ];
    const filled = [{ patternCode: "R", title: "a", body: "x" }];
    expect(missingPatternCodes(filled, "SCALE_TALLY", 2, contents)).toEqual(["I"]);
  });
});

describe("pairTallyPatternCodes", () => {
  it("collects every statement scale in first-appearance order", () => {
    const contents = [
      { question: "a", statements: ["x", "y"], mapping: ["N", "G"] },
      { question: "b", statements: ["x", "y"], mapping: ["g", "A"] },
    ];
    expect(pairTallyPatternCodes(contents)).toEqual(["N", "G", "A"]);
  });

  it("has no cartesian product — one code per scale, not per pair", () => {
    const contents = [{ question: "a", statements: ["x", "y"], mapping: ["N", "G"] }];
    expect(pairTallyPatternCodes(contents)).toEqual(["N", "G"]);
  });

  it("ignores items without a mapping", () => {
    expect(pairTallyPatternCodes([{ question: "a" }, null])).toEqual([]);
  });

  it("drives the publish coverage of a pair tally test", () => {
    const contents = [
      { question: "a", statements: ["x", "y"], mapping: ["N", "G"] },
      { question: "b", statements: ["x", "y"], mapping: ["A", "N"] },
    ];
    const filled = [
      { patternCode: "N", title: "a", body: "x" },
      { patternCode: "G", title: "b", body: "x" },
    ];
    expect(missingPatternCodes(filled, "PAIR_TALLY", 2, contents)).toEqual(["A"]);
  });
});

describe("choiceTallyPatternCodes", () => {
  it("collects the distinct option scales in first-appearance order", () => {
    const contents = [
      { question: "a", options: ["x", "y"], mapping: ["Q", "CA"] },
      { question: "b", options: ["x", "y"], mapping: ["cl", "Q"] },
    ];
    expect(choiceTallyPatternCodes(contents)).toEqual(["Q", "CA", "CL"]);
  });

  it("ignores items without a mapping", () => {
    expect(choiceTallyPatternCodes([{ question: "a" }, null])).toEqual([]);
  });

  it("drives the publish coverage of a choice tally test", () => {
    const contents = [
      { question: "a", options: ["x", "y"], mapping: ["Q", "CA"] },
      { question: "b", options: ["x", "y"], mapping: ["CL", "Q"] },
    ];
    const filled = [
      { patternCode: "Q", title: "a", body: "x" },
      { patternCode: "CA", title: "b", body: "x" },
    ];
    expect(missingPatternCodes(filled, "CHOICE_TALLY", 2, contents)).toEqual(["CL"]);
  });
});
