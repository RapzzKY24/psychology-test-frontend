import { describe, expect, it } from "vitest";
import { isRightWrongItemReady } from "@/features/admin/tests-builder/item-readiness";

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
