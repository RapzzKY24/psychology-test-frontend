import { describe, expect, it } from "vitest";
import { multiSubtestSections, subtestRanges } from "@/lib/multi-subtest";

const CONFIG = {
  subtests: [
    { code: "SE", name: "Melengkapi kalimat", kind: "CHOICE", itemCount: 20, timeLimitMin: 6, instruction: "…" },
    { code: "GE", name: "Dua kata, satu pengertian", kind: "PAIR", itemCount: 16, timeLimitMin: 8, instruction: "…" },
    { code: "ME", name: "Mengingat kata", kind: "CHOICE", itemCount: 20, timeLimitMin: 3, memorizeMin: 3, instruction: "…" },
  ],
};

describe("multiSubtestSections", () => {
  it("reads the split out of the seed config", () => {
    expect(multiSubtestSections(CONFIG).map((section) => section.code)).toEqual([
      "SE",
      "GE",
      "ME",
    ]);
  });

  it("returns nothing when the config is missing or unreadable", () => {
    expect(multiSubtestSections(null)).toEqual([]);
    expect(multiSubtestSections({ subtests: [] })).toEqual([]);
    expect(multiSubtestSections({ subtests: [{ code: "SE" }] })).toEqual([]);
  });
});

describe("subtestRanges", () => {
  it("numbers the printed items from one without gaps", () => {
    expect(subtestRanges(CONFIG).map(({ from, to }) => [from, to])).toEqual([
      [1, 20],
      [21, 36],
      [37, 56],
    ]);
  });

  it("stops at the last declared subtest", () => {
    const ranges = subtestRanges(CONFIG);
    expect(ranges.at(-1)?.to).toBe(56);
  });
});
