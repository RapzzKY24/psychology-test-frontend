import { describe, expect, it } from "vitest";
import {
  CreateTestSchema,
  DiscItemContentSchema,
  LikertItemContentSchema,
  MarkGroupItemContentSchema,
  RankGroupItemContentSchema,
  StyleGridItemContentSchema,
  normalizeLikertContent,
  normalizeMarkGroupContent,
  normalizeRankGroupContent,
  normalizeStyleGridContent,
  slugify,
} from "@/features/admin/tests-builder/schemas";

describe("slugify", () => {
  it("converts a name to a url-safe slug", () => {
    expect(slugify("DISC Form A")).toBe("disc-form-a");
    expect(slugify("  Kecerdasan & Logika!!  ")).toBe("kecerdasan-logika");
    expect(slugify("Tes   Minat--2026")).toBe("tes-minat-2026");
  });

  it("strips characters outside a-z0-9 and hyphens", () => {
    expect(slugify("Psikotes (Edisi 2) — Versi/B")).toBe("psikotes-edisi-2-versi-b");
  });
});

describe("CreateTestSchema", () => {
  const base = {
    name: "DISC Form A",
    slug: "disc-form-a",
    description: "Instrumen kepribadian DISC versi forced choice.",
    category: "PERSONALITY",
    scorerType: "FORCED_CHOICE_DISC",
    price: 150000,
    estimatedDurationMin: 20,
  };

  it("accepts a valid payload", () => {
    expect(CreateTestSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a bad slug and a short description (mirrors backend Zod)", () => {
    expect(CreateTestSchema.safeParse({ ...base, slug: "Bad Slug!" }).success).toBe(false);
    expect(CreateTestSchema.safeParse({ ...base, description: "pendek" }).success).toBe(false);
    expect(CreateTestSchema.safeParse({ ...base, price: -1 }).success).toBe(false);
  });
});

describe("DiscItemContentSchema", () => {
  it("accepts 4 words with 4 most/least mappings", () => {
    const parsed = DiscItemContentSchema.safeParse({
      words: ["Dominan", "Persuasif", "Tenang", "Sistematis"],
      mostMapping: ["D", "I", "S", "C"],
      leastMapping: ["D", "I", "S", "C"],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts * as a neutral mapping", () => {
    const parsed = DiscItemContentSchema.safeParse({
      words: ["a", "b", "c", "d"],
      mostMapping: ["D", "I", "S", "*"],
      leastMapping: ["*", "C", "S", "I"],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects wrong lengths and unknown dimensions", () => {
    expect(
      DiscItemContentSchema.safeParse({
        words: ["a", "b", "c"],
        mostMapping: ["D", "I", "S", "C"],
        leastMapping: ["D", "I", "S", "C"],
      }).success,
    ).toBe(false);
    expect(
      DiscItemContentSchema.safeParse({
        words: ["a", "b", "c", "d"],
        mostMapping: ["D", "I", "S", "X"],
        leastMapping: ["D", "I", "S", "C"],
      }).success,
    ).toBe(false);
  });
});

describe("LikertItemContentSchema", () => {
  it("accepts a statement with a scale and an optional reverse flag", () => {
    expect(LikertItemContentSchema.safeParse({ text: "Saya suka bergaul", scale: "E" }).success).toBe(
      true,
    );
    expect(
      LikertItemContentSchema.safeParse({ text: "Saya mudah cemas", scale: "n", reverse: true })
        .success,
    ).toBe(true);
  });

  it("accepts a numbered type code, so Enneagram can use T1..T9", () => {
    expect(LikertItemContentSchema.parse({ text: "a", scale: "t1" })).toEqual({
      text: "a",
      scale: "T1",
    });
  });

  it("rejects an empty statement or a scale that does not start with a letter", () => {
    expect(LikertItemContentSchema.safeParse({ text: "  ", scale: "E" }).success).toBe(false);
    expect(LikertItemContentSchema.safeParse({ text: "a", scale: "1" }).success).toBe(false);
    expect(LikertItemContentSchema.safeParse({ text: "a", scale: "T-1" }).success).toBe(false);
    expect(LikertItemContentSchema.safeParse({ text: "a", scale: "ABCDEFGHIJKLM" }).success).toBe(
      false,
    );
  });

  it("carries a section through an edit, so MSAI keeps its parts", () => {
    expect(normalizeLikertContent({ text: "a", scale: "teams", section: "behaviour" })).toEqual({
      text: "a",
      scale: "TEAMS",
      reverse: false,
      section: "BEHAVIOUR",
    });
    expect(LikertItemContentSchema.parse({ text: "a", scale: "TEAMS", section: "BEHAVIOUR" })).toEqual(
      { text: "a", scale: "TEAMS", section: "BEHAVIOUR" },
    );
    expect(LikertItemContentSchema.safeParse({ text: "a", scale: "TEAMS", section: "1X" }).success).toBe(
      false,
    );
  });

  it("normalizes a draft into the stored shape", () => {
    expect(normalizeLikertContent({ text: "a", scale: "e" })).toEqual({
      text: "a",
      scale: "E",
      reverse: false,
    });
    expect(normalizeLikertContent(undefined)).toEqual({ text: "", scale: "", reverse: false });
  });
});

describe("RankGroupItemContentSchema", () => {
  const ready = {
    question: "Kelompok A",
    options: ["Petani", "Insinyur sipil"],
    mapping: ["out", "me"],
  };

  it("accepts a group and uppercases its field codes", () => {
    expect(RankGroupItemContentSchema.parse(ready)).toEqual({
      question: "Kelompok A",
      options: ["Petani", "Insinyur sipil"],
      mapping: ["OUT", "ME"],
    });
  });

  it("keeps the workbook's dotted code", () => {
    expect(
      RankGroupItemContentSchema.parse({ ...ready, mapping: ["s.s", "cler"] }).mapping,
    ).toEqual(["S.S", "CLER"]);
  });

  it("rejects a group whose mapping is shorter than its options", () => {
    const parsed = RankGroupItemContentSchema.safeParse({ ...ready, mapping: ["OUT"] });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.some((i) => i.message.includes("satu kode bidang"))).toBe(true);
  });

  it("rejects a female list of a different length", () => {
    const parsed = RankGroupItemContentSchema.safeParse({
      ...ready,
      femaleOptions: ["Petani perempuan"],
    });
    expect(parsed.success).toBe(false);
  });

  it("drops an all-blank female list when a draft is normalized", () => {
    expect(
      normalizeRankGroupContent({
        question: "Kelompok A",
        options: ["Petani", "Akuntan"],
        femaleOptions: ["", ""],
        mapping: ["out", "comp"],
      }),
    ).toEqual({
      question: "Kelompok A",
      options: ["Petani", "Akuntan"],
      mapping: ["OUT", "COMP"],
    });
  });

  it("keeps a female list that has content, padded to the option count", () => {
    expect(
      normalizeRankGroupContent({
        question: "Kelompok A",
        options: ["Petani", "Akuntan"],
        femaleOptions: ["Pekerjaan pertanian"],
        mapping: ["out", "comp"],
      }),
    ).toEqual({
      question: "Kelompok A",
      options: ["Petani", "Akuntan"],
      femaleOptions: ["Pekerjaan pertanian", ""],
      mapping: ["OUT", "COMP"],
    });
  });
});

describe("MarkGroupItemContentSchema", () => {
  const ready = {
    question: "Kelompok 1",
    options: ["Berkebun", "Membongkar mesin"],
    mapping: [["OUT"], ["ME", "COMP"]],
  };

  it("accepts a list where every activity carries its fields", () => {
    expect(MarkGroupItemContentSchema.parse(ready)).toEqual({
      question: "Kelompok 1",
      options: ["Berkebun", "Membongkar mesin"],
      mapping: [["OUT"], ["ME", "COMP"]],
    });
  });

  it("allows an activity that scores no field but feeds the validity scale", () => {
    expect(
      MarkGroupItemContentSchema.safeParse({
        ...ready,
        mapping: [[], ["OUT"]],
        verification: [0],
      }).success,
    ).toBe(true);
  });

  it("rejects a mapping that does not cover every activity", () => {
    const parsed = MarkGroupItemContentSchema.safeParse({ ...ready, mapping: [["OUT"]] });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.some((i) => i.message.includes("daftar bidang"))).toBe(true);
  });

  it("rejects a validity flag on a row that does not exist", () => {
    expect(
      MarkGroupItemContentSchema.safeParse({ ...ready, verification: [5] }).success,
    ).toBe(false);
  });

  it("pads the mapping to the option count when a draft is normalized", () => {
    expect(
      normalizeMarkGroupContent({
        question: "Kelompok 1",
        options: ["Berkebun", "Menanam padi"],
        mapping: [["out"]],
      }),
    ).toEqual({
      question: "Kelompok 1",
      options: ["Berkebun", "Menanam padi"],
      mapping: [["OUT"], []],
    });
  });

  it("drops a validity flag whose row was removed", () => {
    expect(
      normalizeMarkGroupContent({
        question: "Kelompok 1",
        options: ["Berkebun", "Menanam padi"],
        mapping: [["OUT"], []],
        verification: [0, 4],
      }).verification,
    ).toEqual([0]);
  });
});

describe("StyleGridItemContentSchema", () => {
  it("accepts two statements that score the same style", () => {
    expect(
      StyleGridItemContentSchema.safeParse({
        statements: ["kiri", "kanan"],
        mapping: ["DS", "DS"],
      }).success,
    ).toBe(true);
  });

  it("accepts an item with no stem", () => {
    expect(
      StyleGridItemContentSchema.safeParse({
        statements: ["kiri", "kanan"],
        mapping: ["DS", "MI"],
      }).success,
    ).toBe(true);
  });

  it("rejects two identical statements", () => {
    expect(
      StyleGridItemContentSchema.safeParse({
        statements: ["sama", "Sama"],
        mapping: ["DS", "MI"],
      }).success,
    ).toBe(false);
  });

  it("uppercases the codes when a draft is normalized", () => {
    expect(
      normalizeStyleGridContent({ statements: ["kiri", "kanan"], mapping: ["ds", "mi"] }),
    ).toEqual({ statements: ["kiri", "kanan"], mapping: ["DS", "MI"] });
  });

  it("drops an empty stem when a draft is normalized", () => {
    expect(
      normalizeStyleGridContent({
        question: "   ",
        statements: ["kiri", "kanan"],
        mapping: ["DS", "MI"],
      }),
    ).toEqual({ statements: ["kiri", "kanan"], mapping: ["DS", "MI"] });
  });
});
