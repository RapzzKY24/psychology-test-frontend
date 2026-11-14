// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ScoreSummary } from "@/components/shared/score-summary";

afterEach(cleanup);

describe("ScoreSummary", () => {
  it("shows correct answers and accuracy for a right/wrong test", () => {
    render(<ScoreSummary scores={{ raw: 22, total: 30, perItem: [] }} />);

    expect(screen.getByText("22/30")).toBeTruthy();
    expect(screen.getByText("73%")).toBeTruthy();
    expect(screen.getByText("Jawaban benar")).toBeTruthy();
    expect(screen.getByText("Akurasi")).toBeTruthy();
    // The bare keys used to be drawn as bars, which said nothing about the result.
    expect(screen.queryByText("raw")).toBeNull();
    expect(screen.queryByText("total")).toBeNull();
  });

  it("adds the IQ stat only when the test carries a norm table", () => {
    const { unmount } = render(<ScoreSummary scores={{ raw: 35, total: 60, iq: 100 }} />);
    expect(screen.getByText("Skor IQ")).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();
    unmount();

    render(<ScoreSummary scores={{ raw: 22, total: 30 }} />);
    expect(screen.queryByText("Skor IQ")).toBeNull();
  });

  it("shows the MBTI type instead of its counters", () => {
    render(<ScoreSummary scores={{ type: "ISTJ", total: 70, answered: 68, dimensions: {} }} />);

    expect(screen.getByText("Tipe kepribadian")).toBeTruthy();
    expect(screen.getByText("ISTJ")).toBeTruthy();
    expect(screen.getByText("68/70")).toBeTruthy();
    expect(screen.queryByText("Jawaban benar")).toBeNull();
  });

  it("shows the leading scale of a pair tally instead of calling it a type", () => {
    render(
      <ScoreSummary
        scores={{
          type: "G",
          total: 90,
          answered: 90,
          scales: {
            N: { score: 5, max: 9, percent: 56 },
            G: { score: 7, max: 9, percent: 78 },
          },
        }}
      />,
    );

    expect(screen.getByText("Skala dominan")).toBeTruthy();
    // Once in the stat card, once as the bar label.
    expect(screen.getAllByText("G")).toHaveLength(2);
    expect(screen.getByText("90/90")).toBeTruthy();
    expect(screen.queryByText("Tipe kepribadian")).toBeNull();
  });

  it("shows a Likert inventory as scale bars with their bands", () => {
    render(
      <ScoreSummary
        scores={{
          type: "A",
          band: "Tinggi",
          total: 44,
          answered: 44,
          scales: {
            E: { score: 32, max: 40, percent: 80, band: "Tinggi" },
            A: { score: 40, max: 45, percent: 89, band: "Tinggi" },
          },
        }}
      />,
    );

    expect(screen.getByText("Skala tertinggi")).toBeTruthy();
    expect(screen.getByText("Kategori")).toBeTruthy();
    expect(screen.getByText("44/44")).toBeTruthy();
    expect(screen.getByText("89%")).toBeTruthy();
    expect(screen.getByText("80%")).toBeTruthy();
    // The band rides along with the bar label, plus the category stat card.
    expect(screen.getAllByText("Tinggi")).toHaveLength(3);
    expect(screen.queryByText("Skala dominan")).toBeNull();
  });

  it("lines the sections of a multi-section inventory up per scale", () => {
    render(
      <ScoreSummary
        scores={{
          type: "TEAMS",
          total: 85,
          answered: 85,
          scales: {
            TEAMS: { score: 25, max: 25, percent: 100 },
            FUTURE: { score: 5, max: 25, percent: 20 },
          },
          sections: {
            BEHAVIOUR: {
              TEAMS: { score: 25, max: 25, percent: 100 },
              FUTURE: { score: 5, max: 25, percent: 20 },
            },
            EFFECTIVENESS: {
              TEAMS: { score: 4, max: 5, percent: 80 },
              FUTURE: { score: 3, max: 5, percent: 60 },
              OVERALL: { score: 5, max: 5, percent: 100 },
            },
            IMPORTANCE: {
              TEAMS: { score: 5, max: 5, percent: 100 },
              FUTURE: { score: 2, max: 5, percent: 40 },
            },
          },
        }}
      />,
    );

    expect(screen.getByText("Behaviour")).toBeTruthy();
    expect(screen.getByText("Effectiveness")).toBeTruthy();
    expect(screen.getByText("Importance")).toBeTruthy();
    expect(screen.getByText("80%")).toBeTruthy();
    expect(screen.getByText("60%")).toBeTruthy();
    expect(screen.getByText("40%")).toBeTruthy();
    // Rows follow the pattern section, so OVERALL does not become a row.
    expect(screen.queryByText("OVERALL")).toBeNull();
  });

  it("draws the DISC profile from graph, not from the M/P counters", () => {
    render(
      <ScoreSummary scores={{ M: { D: 6 }, P: { D: 2 }, graph: { D: 12, I: 8, S: 5, C: 3 } }} />,
    );

    expect(screen.getByText("D")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.queryByText("Akurasi")).toBeNull();
  });

  it("does not divide by zero on an empty attempt", () => {
    render(<ScoreSummary scores={{ raw: 0, total: 0 }} />);
    expect(screen.getByText("0/0")).toBeTruthy();
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("falls back to a message when there is nothing to show", () => {
    render(<ScoreSummary scores={{}} />);
    expect(screen.getByText("Belum ada skor.")).toBeTruthy();
  });
});
