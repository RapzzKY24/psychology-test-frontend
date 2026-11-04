// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ResultsTable } from "@/features/instansi/results/components/results-table";
import { formatIdDate } from "@/lib/format/format-date";
import type { InstansiResultItem } from "@/lib/api/types";

vi.mock("@/features/instansi/results/components/instansi-certificate-download-button", () => ({
  InstansiCertificateDownloadButton: () => <button type="button">Sertifikat</button>,
}));

const row: InstansiResultItem = {
  resultId: "r1",
  participantName: "Budi Santoso",
  testName: "DISC",
  patternCode: "DISC-D",
  scores: { graph: { D: 7, I: 3 } },
  approvedAt: "2026-10-01T00:00:00.000Z",
  certificate: null,
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

  it("offers no download when the result has no live certificate", () => {
    render(<ResultsTable rows={[row]} meta={meta} pageHref={pageHref} />);

    expect(screen.queryByRole("button", { name: /sertifikat/i })).toBeNull();
  });

  it("offers the certificate download once one is issued", () => {
    render(
      <ResultsTable
        rows={[{ ...row, certificate: { id: "c1", number: "060/TES/YM/XI/2026" } }]}
        meta={meta}
        pageHref={pageHref}
      />,
    );

    expect(screen.getByRole("button", { name: /sertifikat/i })).toBeTruthy();
  });
});
