import { describe, expect, it } from "vitest";
import { PATTERN_CODES } from "@/features/admin/tests-builder/constants";
import {
  bandCode,
  choiceTallyPatternCodes,
  coverage,
  likertPatternCodes,
  likertSections,
  missingPatternCodes,
  markGroupPatternCodes,
  pairTallyPatternCodes,
  rankGroupPatternCodes,
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

describe("bandCode", () => {
  it("turns a band label into a pattern-code fragment", () => {
    expect(bandCode("Sangat Tinggi")).toBe("SANGAT_TINGGI");
    expect(bandCode("  rendah ")).toBe("RENDAH");
  });
});

describe("likertPatternCodes", () => {
  const contents = [
    { text: "a", scale: "E" },
    { text: "b", scale: "a" },
    { text: "c", scale: "E", reverse: true },
  ];
  const bands = [
    { max: 33, label: "Rendah" },
    { max: 66, label: "Sedang" },
    { max: 100, label: "Tinggi" },
  ];

  it("crosses every scale with every band", () => {
    expect(likertPatternCodes(contents, { bands })).toEqual([
      "E_RENDAH",
      "E_SEDANG",
      "E_TINGGI",
      "A_RENDAH",
      "A_SEDANG",
      "A_TINGGI",
    ]);
  });

  it("falls back to the bare scales when the test declares no bands", () => {
    expect(likertPatternCodes(contents, undefined)).toEqual(["E", "A"]);
    expect(likertPatternCodes(contents, { bands: [] })).toEqual(["E", "A"]);
  });

  it("drives the publish coverage of a Likert test", () => {
    const filled = [
      { patternCode: "E_RENDAH", title: "a", body: "x" },
      { patternCode: "E_SEDANG", title: "b", body: "x" },
    ];
    expect(missingPatternCodes(filled, "LIKERT", 3, contents, { bands })).toEqual([
      "E_TINGGI",
      "A_RENDAH",
      "A_SEDANG",
      "A_TINGGI",
    ]);
  });

  it("counts the cross-product as the total", () => {
    expect(coverage([], "LIKERT", 3, contents, { bands })).toEqual({
      filled: 0,
      total: 6,
      missing: 6,
    });
  });
});

describe("likertPatternCodes with sections", () => {
  const contents = [
    { text: "a", scale: "TEAMS", section: "BEHAVIOUR" },
    { text: "b", scale: "FUTURE", section: "BEHAVIOUR" },
    { text: "c", scale: "TEAMS", section: "IMPORTANCE" },
  ];

  it("counts only the pattern section, like the backend", () => {
    expect(likertPatternCodes(contents, { patternSection: "BEHAVIOUR" })).toEqual([
      "TEAMS",
      "FUTURE",
    ]);
    expect(likertPatternCodes(contents, { patternSection: "IMPORTANCE" })).toEqual(["TEAMS"]);
  });

  it("defaults to the first section when the config names none", () => {
    expect(likertPatternCodes(contents)).toEqual(["TEAMS", "FUTURE"]);
  });

  it("ignores a pattern section the items do not use", () => {
    expect(likertPatternCodes(contents, { patternSection: "NOPE" })).toEqual(["TEAMS", "FUTURE"]);
  });

  it("lists the sections in first-appearance order", () => {
    expect(likertSections(contents)).toEqual(["BEHAVIOUR", "IMPORTANCE"]);
    expect(likertSections([{ text: "a", scale: "E" }])).toEqual([]);
  });
});

describe("rankGroupPatternCodes", () => {
  const groups = [
    { question: "Kelompok A", options: ["a", "b"], mapping: ["out", "me"] },
    { question: "Kelompok B", options: ["c", "d"], mapping: ["ME", "s.s"] },
  ];

  it("collects the interest fields in first-appearance order", () => {
    expect(rankGroupPatternCodes(groups)).toEqual(["OUT", "ME", "S.S"]);
  });

  it("ignores rows that are not groups", () => {
    expect(rankGroupPatternCodes([{ question: "x" }, null, { mapping: "nope" }])).toEqual([]);
  });

  it("feeds getPatternCodes for the family", () => {
    expect(missingPatternCodes([], "RANK_GROUP", 2, groups)).toEqual(["OUT", "ME", "S.S"]);
  });
});

describe("markGroupPatternCodes", () => {
  const lists = [
    { question: "Kelompok 1", options: ["a", "b"], mapping: [["out"], ["ME", "comp"]] },
    { question: "Kelompok 2", options: ["c", "d"], mapping: [[], ["s.s"]] },
  ];

  it("collects every field an activity loads on, in first-appearance order", () => {
    expect(markGroupPatternCodes(lists)).toEqual(["OUT", "ME", "COMP", "S.S"]);
  });

  it("ignores rows that are not lists", () => {
    expect(markGroupPatternCodes([{ question: "x" }, null, { mapping: "nope" }])).toEqual([]);
  });

  it("feeds getPatternCodes for the family", () => {
    expect(missingPatternCodes([], "MARK_GROUP", 2, lists)).toEqual([
      "OUT",
      "ME",
      "COMP",
      "S.S",
    ]);
  });
});
