import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCORER_BY_CATEGORY,
  SCORER_OPTIONS,
  scorerOption,
} from "@/features/admin/tests-builder/scorers";

describe("scorer options", () => {
  it("offers every item editor", () => {
    expect(SCORER_OPTIONS.map((option) => option.value)).toEqual([
      "RIGHT_WRONG_NORM",
      "FORCED_CHOICE_PAIR",
      "PAIR_TALLY",
      "PAIR_NORM",
      "STYLE_GRID",
      "FORCED_CHOICE_DISC",
      "SCALE_TALLY",
      "CHOICE_TALLY",
      "MARK_GROUP",
      "RANK_GROUP",
      "LIKERT",
      "OPTION_SCALE",
    ]);
  });

  it("suggests multiple choice for cognitive tests", () => {
    expect(DEFAULT_SCORER_BY_CATEGORY.COGNITIVE).toBe("RIGHT_WRONG_NORM");
  });

  it("suggests DISC for the personality-style categories", () => {
    expect(DEFAULT_SCORER_BY_CATEGORY.PERSONALITY).toBe("FORCED_CHOICE_DISC");
    expect(DEFAULT_SCORER_BY_CATEGORY.WORK_STYLE).toBe("FORCED_CHOICE_DISC");
    expect(DEFAULT_SCORER_BY_CATEGORY.PROJECTIVE).toBe("FORCED_CHOICE_DISC");
  });

  it("suggests a scale tally for interest inventories", () => {
    expect(DEFAULT_SCORER_BY_CATEGORY.INTEREST).toBe("SCALE_TALLY");
  });

  it("returns the label and description for a type", () => {
    const option = scorerOption("RIGHT_WRONG_NORM");

    expect(option.label).toBe("Pilihan ganda");
    expect(option.description).toContain("jumlah jawaban benar");
  });
});
