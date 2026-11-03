import { describe, expect, it } from "vitest";
import { getPatternCodes, pairPatternCodes } from "@/features/admin/tests-builder/coverage";

const item = (left: string, right: string) => ({
  question: "Pilih",
  statements: ["a", "b"],
  mapping: [left, right],
});

describe("pairPatternCodes", () => {
  it("builds the cartesian product of the four dichotomies", () => {
    const codes = pairPatternCodes([item("E", "I"), item("S", "N"), item("T", "F"), item("J", "P")]);

    expect(codes).toHaveLength(16);
    expect(codes).toContain("ESTJ");
    expect(codes).toContain("INFP");
  });

  it("treats a reversed pair as the same dimension", () => {
    const codes = pairPatternCodes([item("E", "I"), item("I", "E")]);

    expect(codes).toEqual(["E", "I"]);
  });

  it("returns nothing while the items have no mapping yet", () => {
    expect(pairPatternCodes([{ question: "Pilih", statements: ["a", "b"], mapping: ["", ""] }])).toEqual(
      [],
    );
  });

  it("is what getPatternCodes returns for the pair family", () => {
    const items = [item("E", "I"), item("S", "N")];

    expect(getPatternCodes("FORCED_CHOICE_PAIR", items.length, items)).toEqual(["ES", "EN", "IS", "IN"]);
  });
});
