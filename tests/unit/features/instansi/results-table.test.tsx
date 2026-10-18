// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ResultsTable } from "@/features/instansi/results/components/results-table";
import { formatIdDate } from "@/lib/format/format-date";
import type { InstansiResultItem } from "@/lib/api/types";

const row: InstansiResultItem = {
  resultId: "r1",
  participantName: "Budi Santoso",
  testName: "DISC",
  patternCode: "DISC-D",
  scores: { graph: { D: 7, I: 3 } },
  approvedAt: "2026-10-01T00:00:00.000Z",
};

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
const pageHref = (page: number) => `/instansi/hasil?page=${page}`;

afterEach(cleanup);

describe("ResultsTable", () => {
  it("renders the empty state when there are no results", () => {
    render(<ResultsTable rows={[]} meta={{ ...meta, total: 0 }} pageHref={pageHref} />);

    expect(screen.getByText("Belum ada hasil yang dirilis")).toBeTruthy();
  });

  it("lists approved results with summary and date", () => {
    render(<ResultsTable rows={[row]} meta={meta} pageHref={pageHref} />);

    expect(screen.getByText("Budi Santoso")).toBeTruthy();
    expect(screen.getByText("DISC")).toBeTruthy();
    expect(screen.getByText(/DISC-D/)).toBeTruthy();
    expect(screen.getByText(formatIdDate(row.approvedAt))).toBeTruthy();
  });

  it("does not render the deferred PDF action", () => {
    render(<ResultsTable rows={[row]} meta={meta} pageHref={pageHref} />);

    expect(screen.queryByText(/PDF/i)).toBeNull();
  });
});
