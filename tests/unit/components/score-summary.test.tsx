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

  it("shows the top three interests for a ranking instrument", () => {
    render(
      <ScoreSummary
        scores={{
          type: "OUT_S.S_MUS",
          dominant: "OUT",
          total: 9,
          answered: 9,
          scales: {
            OUT: { score: 9, min: 9, max: 108, percent: 100 },
            MUS: { score: 60, min: 9, max: 108, percent: 48 },
          },
        }}
      />,
    );

    expect(screen.getByText("Minat utama")).toBeTruthy();
    // Once as the headline stat, once as the bar label.
    expect(screen.getAllByText("OUT")).toHaveLength(2);
    expect(screen.getByText("Tiga minat terkuat")).toBeTruthy();
    expect(screen.getByText("OUT · S.S · MUS")).toBeTruthy();
    expect(screen.getByText("9/9")).toBeTruthy();
    // The scales still get their bars, so the reader sees the whole profile.
    expect(screen.getByText("100%")).toBeTruthy();
    expect(screen.getByText("48%")).toBeTruthy();
  });

  it("shows a marked list's top interests and its validity scale", () => {
    render(
      <ScoreSummary
        scores={{
          type: "OUT_PER_ART",
          dominant: "OUT",
          answered: 12,
          total: 12,
          gender: "FEMALE",
          scales: {
            OUT: { score: 14, min: -122, max: 122, percent: 88, band: "Tinggi" },
            PER: { score: 6, min: -125, max: 125, percent: 55, band: "Cukup" },
            ART: { score: 2, min: -78, max: 78, percent: 40, band: "Cukup" },
          },
          verification: {
            raw: 41,
            max: 63,
            band: "Valid",
          },
        }}
      />,
    );

    expect(screen.getByText("Minat utama")).toBeTruthy();
    expect(screen.getAllByText("OUT").length).toBeGreaterThan(0);
    expect(screen.getByText("OUT · PER · ART")).toBeTruthy();
    expect(screen.getByText("Kelompok terjawab")).toBeTruthy();
    expect(screen.getByText("12/12")).toBeTruthy();
    expect(screen.getByText("Skala validitas 41/63")).toBeTruthy();
    expect(screen.getByText("Valid")).toBeTruthy();
    expect(screen.getByText("88%")).toBeTruthy();
  });

  it("flags a protocol the validity scale rejects", () => {
    render(
      <ScoreSummary
        scores={{
          dominant: "OUT",
          type: "OUT_ME_ART",
          scales: { OUT: { score: 2, min: -2, max: 2, percent: 90, band: "Tinggi" } },
          verification: {
            raw: 4,
            max: 63,
            band: "Kurang valid dikarenakan testee kurang bersungguh-sungguh.",
          },
        }}
      />,
    );

    expect(screen.getByText("Skala validitas 4/63")).toBeTruthy();
    expect(
      screen.getByText("Kurang valid dikarenakan testee kurang bersungguh-sungguh."),
    ).toBeTruthy();
  });

  it("names the leadership style and draws its dimension levels", () => {
    render(
      <ScoreSummary
        scores={{
          total: 64,
          answered: 64,
          maxLevel: 4,
          profile: { code: "DV", label: "Developer" },
          dimensions: {
            TO: { label: "Task orientation", score: 31, level: 0.6, high: false },
            RO: { label: "Relationship orientation", score: 34, level: 2.4, high: true },
            EF: { label: "Effectiveness", score: 36, level: 3.6, high: true },
            O: { label: "Other", score: 8, level: 0, high: false },
          },
          scales: { DS: { score: 8, max: 16, correction: 1 } },
        }}
      />,
    );

    expect(screen.getByText("Gaya kepemimpinan")).toBeTruthy();
    expect(screen.getByText("Developer")).toBeTruthy();
    expect(screen.getByText("64/64")).toBeTruthy();
    // The bar carries the level itself, not a percent of an unknown ceiling.
    expect(screen.getByText("Task orientation")).toBeTruthy();
    expect(screen.getByText("0.6/4 · Rendah")).toBeTruthy();
    expect(screen.getByText("3.6/4 · Tinggi")).toBeTruthy();
    expect(screen.getByText("2.4")).toBeTruthy();
  });

  it("falls back to the dimension code when the config carries no label", () => {
    render(
      <ScoreSummary
        scores={{
          maxLevel: 4,
          profile: { code: "MI", label: "Missionary" },
          dimensions: { TO: { score: 20, level: 0, high: false } },
        }}
      />,
    );

    expect(screen.getByText("TO")).toBeTruthy();
    expect(screen.getByText("0/4 · Rendah")).toBeTruthy();
  });

  it("names the dominant need and prints its percentile, not the raw count", () => {
    render(
      <ScoreSummary
        scores={{
          type: "ACH",
          total: 225,
          answered: 225,
          normSet: "college",
          gender: "FEMALE",
          scales: {
            ACH: { label: "Achievement", score: 17, max: 28, percent: 84, band: "Sedang" },
            DEF: { label: "Deference", score: 9, max: 28, percent: 21, band: "Sedang" },
          },
          consistency: { raw: 12, max: 15, band: "Konsisten", valid: true },
        }}
      />,
    );

    expect(screen.getByText("Kebutuhan dominan")).toBeTruthy();
    // The percentile heads the card and fills the bar of the same need.
    expect(screen.getAllByText("84%")).toHaveLength(2);
    expect(screen.getByText("225/225")).toBeTruthy();
    // The bar is named after the need, not after its three-letter code.
    expect(screen.getAllByText("Achievement").length).toBeGreaterThan(0);
    expect(screen.queryByText("ACH")).toBeNull();
    expect(screen.getByText("Konsistensi jawaban 12/15")).toBeTruthy();
    expect(screen.getByText("Konsisten")).toBeTruthy();
  });

  it("flags an inconsistent protocol without a band name to guess", () => {
    render(
      <ScoreSummary
        scores={{
          type: "NUR",
          total: 225,
          answered: 225,
          normSet: "college",
          scales: {
            NUR: { label: "Nurturance", score: 20, max: 28, percent: 88, band: "Tinggi" },
          },
          consistency: { raw: 6, max: 15, band: "Meragukan", valid: false },
        }}
      />,
    );

    expect(screen.getByText("Konsistensi jawaban 6/15")).toBeTruthy();
    expect(screen.getByText("Meragukan")).toBeTruthy();
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
