import { describe, expect, it } from "vitest";
import {
  CreateTestSchema,
  DiscItemContentSchema,
  LikertItemContentSchema,
  normalizeLikertContent,
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

  it("normalizes a draft into the stored shape", () => {
    expect(normalizeLikertContent({ text: "a", scale: "e" })).toEqual({
      text: "a",
      scale: "E",
      reverse: false,
    });
    expect(normalizeLikertContent(undefined)).toEqual({ text: "", scale: "", reverse: false });
  });
});
