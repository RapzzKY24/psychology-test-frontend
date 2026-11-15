import { describe, expect, it } from "vitest";
import {
  isChoiceTallyItemReady,
  isMarkGroupItemReady,
  isPairItemReady,
  isPairNormItemReady,
  isRankGroupItemReady,
  isRightWrongItemReady,
  isScaleTallyItemReady,
  isStyleGridItemReady,
} from "@/features/admin/tests-builder/item-readiness";

describe("isRightWrongItemReady", () => {
  it("is ready when the question, every option and the key are filled", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "choice",
        question: "2 + 3 = ?",
        options: ["4", "5", "6", "7"],
        correctIndexes: [1],
      }),
    ).toBe(true);
  });

  it("is not ready without a ticked key", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "choice",
        question: "2 + 3 = ?",
        options: ["4", "5"],
        correctIndexes: [],
      }),
    ).toBe(false);
  });

  it("is not ready when only the question is filled", () => {
    expect(
      isRightWrongItemReady({ answerMode: "choice", question: "2 + 3 = ?", options: ["", ""] }),
    ).toBe(false);
  });

  it("is not ready when an option is blank", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "choice",
        question: "2 + 3 = ?",
        options: ["4", " "],
        correctIndexes: [0],
      }),
    ).toBe(false);
  });

  it("accepts an image-only item", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "choice",
        imageUrl: "/uploads/test-items/abc.png",
        options: ["4", "5"],
        correctIndexes: [0],
      }),
    ).toBe(true);
  });

  it("is not ready without a prompt", () => {
    expect(
      isRightWrongItemReady({ answerMode: "choice", options: ["4", "5"], correctIndexes: [0] }),
    ).toBe(false);
  });

  it("is not ready without options", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "choice",
        question: "2 + 3 = ?",
        options: [],
        correctIndexes: [0],
      }),
    ).toBe(false);
  });

  it("accepts a short-answer item with one filled variant", () => {
    expect(
      isRightWrongItemReady({
        answerMode: "short",
        question: "Harga ½ lusin?",
        accepted: ["20"],
      }),
    ).toBe(true);
  });

  it("rejects a short-answer item whose only variant is blank", () => {
    expect(
      isRightWrongItemReady({ answerMode: "short", question: "Harga?", accepted: [" "] }),
    ).toBe(false);
  });
});

describe("isPairItemReady", () => {
  const ready = {
    question: "Mana yang lebih Anda pilih?",
    statements: ["Saya suka keramaian", "Saya suka menyendiri"],
    mapping: ["E", "I"],
  };

  it("is ready with two statements on two different poles", () => {
    expect(isPairItemReady(ready)).toBe(true);
  });

  it("compares poles case-insensitively", () => {
    expect(isPairItemReady({ ...ready, mapping: ["e", "i"] })).toBe(true);
  });

  it("is not ready when both statements score the same pole", () => {
    expect(isPairItemReady({ ...ready, mapping: ["E", "E"] })).toBe(false);
  });

  it("is not ready without a question", () => {
    expect(isPairItemReady({ ...ready, question: "  " })).toBe(false);
  });

  it("is not ready when a statement is blank", () => {
    expect(isPairItemReady({ ...ready, statements: ["Saya suka keramaian", ""] })).toBe(false);
  });

  it("is not ready when a pole is missing", () => {
    expect(isPairItemReady({ ...ready, mapping: ["E", ""] })).toBe(false);
  });
});

describe("isScaleTallyItemReady", () => {
  const ready = {
    question: "Senang menonton drama",
    options: ["Ya", "Tidak"],
    scale: "A",
  };

  it("is ready with a statement, two labels and a scale", () => {
    expect(isScaleTallyItemReady(ready)).toBe(true);
  });

  it("is not ready without a statement", () => {
    expect(isScaleTallyItemReady({ ...ready, question: " " })).toBe(false);
  });

  it("is not ready when the scale is missing", () => {
    expect(isScaleTallyItemReady({ ...ready, scale: "" })).toBe(false);
  });

  it("is not ready when a label is blank", () => {
    expect(isScaleTallyItemReady({ ...ready, options: ["Ya", ""] })).toBe(false);
  });
});

describe("isChoiceTallyItemReady", () => {
  const ready = {
    question: "Bagi saya, kesulitan adalah …",
    options: ["Tantangan", "Risiko", "Jalan buntu"],
    mapping: ["Q", "CA", "CL"],
  };

  it("is ready when every option carries its own scale", () => {
    expect(isChoiceTallyItemReady(ready)).toBe(true);
  });

  it("is not ready without a question", () => {
    expect(isChoiceTallyItemReady({ ...ready, question: "  " })).toBe(false);
  });

  it("is not ready when a scale is missing", () => {
    expect(isChoiceTallyItemReady({ ...ready, mapping: ["Q", "", "CL"] })).toBe(false);
  });

  it("is not ready when mapping and options are out of sync", () => {
    expect(isChoiceTallyItemReady({ ...ready, mapping: ["Q", "CA"] })).toBe(false);
  });

  it("is not ready with a single option", () => {
    expect(isChoiceTallyItemReady({ ...ready, options: ["Tantangan"], mapping: ["Q"] })).toBe(
      false,
    );
  });

  it("is not ready when an option is blank", () => {
    expect(isChoiceTallyItemReady({ ...ready, options: ["Tantangan", " ", "Jalan buntu"] })).toBe(
      false,
    );
  });
});

describe("isRankGroupItemReady", () => {
  const ready = {
    question: "Kelompok A",
    options: ["Petani", "Insinyur sipil"],
    mapping: ["OUT", "ME"],
  };

  it("is ready with a label, two occupations and one field each", () => {
    expect(isRankGroupItemReady(ready)).toBe(true);
  });

  it("is ready when the female list mirrors the male list", () => {
    expect(
      isRankGroupItemReady({ ...ready, femaleOptions: ["Pekerjaan pertanian", "Sopir militer"] }),
    ).toBe(true);
  });

  it("is not ready while the female list is half filled", () => {
    expect(isRankGroupItemReady({ ...ready, femaleOptions: ["Pekerjaan pertanian", ""] })).toBe(
      false,
    );
  });

  it("is not ready without a group label", () => {
    expect(isRankGroupItemReady({ ...ready, question: "  " })).toBe(false);
  });

  it("is not ready when a field code is missing", () => {
    expect(isRankGroupItemReady({ ...ready, mapping: ["OUT", ""] })).toBe(false);
  });
});

describe("isMarkGroupItemReady", () => {
  const ready = {
    question: "Kelompok 1",
    options: ["Berkebun", "Membongkar mesin"],
    mapping: [["OUT"], ["ME"]],
  };

  it("is ready with a label, two activities and their fields", () => {
    expect(isMarkGroupItemReady(ready)).toBe(true);
  });

  it("is ready when an activity scores no field at all", () => {
    expect(isMarkGroupItemReady({ ...ready, mapping: [[], ["ME"]] })).toBe(true);
  });

  it("is not ready while an activity has no text", () => {
    expect(isMarkGroupItemReady({ ...ready, options: ["Berkebun", " "] })).toBe(false);
  });

  it("is not ready without a group label", () => {
    expect(isMarkGroupItemReady({ ...ready, question: "  " })).toBe(false);
  });

  it("is not ready when the mapping has fewer rows than activities", () => {
    expect(isMarkGroupItemReady({ ...ready, mapping: [["OUT"]] })).toBe(false);
  });
});

describe("isStyleGridItemReady", () => {
  it("is ready with two statements and two codes", () => {
    expect(isStyleGridItemReady({ statements: ["kiri", "kanan"], mapping: ["DS", "MI"] })).toBe(
      true,
    );
  });

  it("is ready when both statements score the same style", () => {
    expect(isStyleGridItemReady({ statements: ["kiri", "kanan"], mapping: ["DS", "DS"] })).toBe(
      true,
    );
  });

  it("does not need a question stem", () => {
    expect(isStyleGridItemReady({ statements: ["kiri", "kanan"], mapping: ["DS", "DS"] })).toBe(
      true,
    );
  });

  it("is not ready while a statement is empty", () => {
    expect(isStyleGridItemReady({ statements: ["kiri", " "], mapping: ["DS", "MI"] })).toBe(false);
  });

  it("is not ready while a code is missing", () => {
    expect(isStyleGridItemReady({ statements: ["kiri", "kanan"], mapping: ["DS", ""] })).toBe(false);
  });
});

describe("isPairNormItemReady", () => {
  it("is ready with two statements and two needs", () => {
    expect(isPairNormItemReady({ statements: ["kiri", "kanan"], mapping: ["ACH", "DEF"] })).toBe(
      true,
    );
  });

  it("is ready when both statements score the same need", () => {
    expect(isPairNormItemReady({ statements: ["kiri", "kanan"], mapping: ["ACH", "ACH"] })).toBe(
      true,
    );
  });

  it("is not ready while a statement is empty", () => {
    expect(isPairNormItemReady({ statements: ["kiri", " "], mapping: ["ACH", "DEF"] })).toBe(false);
  });

  it("is not ready while a code is missing", () => {
    expect(isPairNormItemReady({ statements: ["kiri", "kanan"], mapping: ["ACH", ""] })).toBe(
      false,
    );
  });
});
