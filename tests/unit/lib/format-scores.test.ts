import { describe, expect, it } from "vitest";
import { isRawPatternCode, safeRenderScores, scoreSummaryText } from "@/lib/format/format-scores";

describe("scoreSummaryText", () => {
  it("summarises a right/wrong score, with IQ when the test has a norm table", () => {
    expect(scoreSummaryText({ raw: 9, total: 50, perItem: [false, true] })).toBe("9/50 benar");
    expect(scoreSummaryText({ raw: 35, total: 60, iq: 100 })).toBe("35/60 benar · IQ 100");
  });

  it("reads the DISC profile from graph, not from the M/P counters", () => {
    const scores = { M: { D: 6 }, P: { D: 2 }, graph: { D: 10, I: 5, S: 3, C: 2 } };
    expect(scoreSummaryText(scores)).toBe("D 10 · I 5 · S 3 · C 2");
  });

  it("uses the MBTI type as the summary", () => {
    const scores = { type: "ISTJ", total: 70, answered: 70, dimensions: {} };
    expect(scoreSummaryText(scores)).toBe("ISTJ");
  });

  it("never prints raw JSON", () => {
    expect(scoreSummaryText({ graph: { a: "x".repeat(100) } })).toBe("—");
    expect(scoreSummaryText({ nested: { deep: true } })).toBe("—");
  });

  it("handles missing and malformed scores", () => {
    expect(scoreSummaryText(null)).toBe("—");
    expect(scoreSummaryText(undefined)).toBe("—");
    expect(scoreSummaryText([])).toBe("—");
    expect(scoreSummaryText("RAW_9")).toBe("—");
  });
});

describe("isRawPatternCode", () => {
  it("spots the raw-score buckets that repeat the score", () => {
    expect(isRawPatternCode("RAW_22")).toBe(true);
    expect(isRawPatternCode(" raw_0 ")).toBe(true);
    expect(isRawPatternCode("ISTJ")).toBe(false);
    expect(isRawPatternCode("")).toBe(false);
    expect(isRawPatternCode(null)).toBe(false);
  });
});

describe("safeRenderScores", () => {
  it("drops a RAW_n code because the summary already carries the score", () => {
    expect(safeRenderScores({ raw: 22, total: 30 }, "RAW_22")).toBe("22/30 benar");
  });

  it("keeps a meaningful code in front of the summary", () => {
    const disc = { M: {}, P: {}, graph: { D: 10, I: 5, S: 3, C: 2 } };
    expect(safeRenderScores(disc, "17")).toBe("17 · D 10 · I 5 · S 3 · C 2");
  });

  it("does not repeat an MBTI type", () => {
    const mbti = { type: "ISTJ", total: 70, answered: 70, dimensions: {} };
    expect(safeRenderScores(mbti, "ISTJ")).toBe("ISTJ");
  });

  it("falls back to the code when the scores are missing", () => {
    expect(safeRenderScores(null, "DISC-D")).toBe("DISC-D");
  });

  it("falls back to — when there is nothing at all", () => {
    expect(safeRenderScores(null, "")).toBe("—");
    expect(safeRenderScores(undefined, "   ")).toBe("—");
  });
});
