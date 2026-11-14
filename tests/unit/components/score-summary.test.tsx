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
    expect(screen.getByText("G")).toBeTruthy();
    expect(screen.getByText("90/90")).toBeTruthy();
    expect(screen.queryByText("Tipe kepribadian")).toBeNull();
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
