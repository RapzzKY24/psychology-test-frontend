import { describe, expect, it } from "vitest";
import { optionLetter, usesPositionalLabels } from "@/lib/format/option-labels";

describe("option-labels", () => {
  it("maps an index to its position letter", () => {
    expect(optionLetter(0)).toBe("A");
    expect(optionLetter(5)).toBe("F");
  });

  it("spots a figure item labelled with letters", () => {
    expect(usesPositionalLabels(["a", "b", "c", "d", "e", "f"])).toBe(true);
    expect(usesPositionalLabels(["A", "B", "C"])).toBe(true);
  });

  it("spots a figure item labelled with numbers", () => {
    expect(usesPositionalLabels(["1", "2", "3", "4", "5"])).toBe(true);
  });

  it("leaves written options alone", () => {
    expect(usesPositionalLabels(["Jakarta", "Bandung"])).toBe(false);
    // Aptitude asks for a letter that is content, not position: A Z F N E.
    expect(usesPositionalLabels(["A", "Z", "F", "N", "E"])).toBe(false);
    // …and for a number that is the answer itself.
    expect(usesPositionalLabels(["4", "4½", "5", "½", "6"])).toBe(false);
  });

  it("handles an empty option list", () => {
    expect(usesPositionalLabels(undefined)).toBe(false);
    expect(usesPositionalLabels([])).toBe(false);
  });
});
