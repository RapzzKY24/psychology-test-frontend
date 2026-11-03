import { describe, expect, it } from "vitest";
import { partitionInterpretations } from "@/features/admin/tests-builder/coverage";

describe("partitionInterpretations", () => {
  it("separates finished rows from half-typed ones", () => {
    const { complete, partial } = partitionInterpretations([
      { patternCode: "1", title: "Judul", body: "Isi" },
      { patternCode: "2", title: "Judul saja", body: "" },
      { patternCode: "3", title: "", body: "Isi saja" },
      { patternCode: "4", title: "", body: "" },
    ]);

    expect(complete.map((row) => row.patternCode)).toEqual(["1"]);
    expect(partial.map((row) => row.patternCode)).toEqual(["2", "3"]);
  });

  it("treats whitespace as empty", () => {
    const { complete, partial } = partitionInterpretations([
      { patternCode: "1", title: "   ", body: "  " },
    ]);

    expect(complete).toEqual([]);
    expect(partial).toEqual([]);
  });
});
