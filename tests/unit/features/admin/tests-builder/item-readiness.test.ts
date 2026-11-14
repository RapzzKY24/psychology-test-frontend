import { describe, expect, it } from "vitest";
import {
  isPairItemReady,
  isRightWrongItemReady,
  isScaleTallyItemReady,
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
