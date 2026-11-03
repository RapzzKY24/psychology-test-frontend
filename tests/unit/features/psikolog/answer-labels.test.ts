import { describe, expect, it } from "vitest";
import {
  chosenIndexes,
  choiceLabel,
  isShortItem,
  keyLabel,
  responseLabel,
} from "@/features/psikolog/review/lib/answer-labels";
import type { RightWrongItemContent } from "@/lib/api/types";

const choiceItem: RightWrongItemContent = {
  answerMode: "choice",
  question: "2 + 2 = ?",
  options: ["3", "4"],
  correctIndexes: [1],
};

const multiItem: RightWrongItemContent = {
  answerMode: "choice",
  options: ["A", "B", "C", "D", "E"],
  correctIndexes: [1, 4],
};

const shortItem: RightWrongItemContent = {
  answerMode: "short",
  question: "Harga ½ lusin?",
  accepted: ["20"],
};

const legacyItem: RightWrongItemContent = {
  answerMode: "choice",
  options: ["3", "4"],
  correctIndex: 0,
};

describe("answer-labels", () => {
  it("reads both response shapes", () => {
    expect(chosenIndexes({ chosen: [2] })).toEqual([2]);
    expect(chosenIndexes({ chosen: 2 })).toEqual([2]);
    expect(chosenIndexes({ text: "20" })).toEqual([]);
    expect(chosenIndexes(undefined)).toEqual([]);
  });

  it("labels a choice answer with its letter and text", () => {
    expect(choiceLabel(["3", "4"], [1])).toBe("B. 4");
    expect(choiceLabel(["3", "4"], [])).toBe("—");
  });

  it("falls back to the letter when the option is missing", () => {
    expect(choiceLabel(undefined, [0])).toBe("A");
  });

  it("labels a multi-answer choice", () => {
    expect(responseLabel(multiItem, { chosen: [4, 1] })).toBe("E. E, B. B");
  });

  it("labels a short answer with the typed text", () => {
    expect(isShortItem(shortItem)).toBe(true);
    expect(responseLabel(shortItem, { text: " 20 " })).toBe("20");
    expect(responseLabel(shortItem, undefined)).toBe("—");
  });

  it("prints the accepted variants as the key", () => {
    expect(keyLabel(shortItem)).toBe("20");
    expect(keyLabel(choiceItem)).toBe("B. 4");
    expect(keyLabel(multiItem)).toBe("B. B, E. E");
  });

  it("still prints the legacy single key", () => {
    expect(keyLabel(legacyItem)).toBe("A. 3");
  });

  it("handles a missing item", () => {
    expect(keyLabel(undefined)).toBe("—");
    expect(responseLabel(undefined, { chosen: 0 })).toBe("A");
  });
});
