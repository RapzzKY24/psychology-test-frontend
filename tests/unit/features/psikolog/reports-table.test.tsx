// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ReportsTable } from "@/features/psikolog/reports/components/reports-table";
import type { ReportListItem } from "@/lib/api/types";

vi.mock("@/features/psikolog/reports/components/report-download-button", () => ({
  ReportDownloadButton: () => null,
}));

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
const pageHref = (page: number) => `/psikolog/laporan?page=${page}`;

function row(overrides: Partial<ReportListItem> = {}): ReportListItem {
  return {
    id: "r1",
    participantId: "p1",
    participantName: "Budi Santoso",
    sessionId: "s1",
    sessionTitle: "CPMI Batch November",
    number: "050/PSIKOTES/YM/XI/2026",
    revision: 1,
    status: "ACTIVE",
    issuedAt: "2026-11-02T08:21:00.695Z",
    testsApproved: 1,
    testsTotal: 1,
    ...overrides,
  };
}

afterEach(cleanup);

describe("ReportsTable", () => {
  it("links an active report number so the psychologist can read it back", () => {
    render(<ReportsTable rows={[row()]} meta={meta} pageHref={pageHref} />);

    const link = screen.getByText("050/PSIKOTES/YM/XI/2026").closest("a");
    expect(link?.getAttribute("href")).toBe("/psikolog/laporan/p1");
  });

  it("does not link a revoked report number", () => {
    render(<ReportsTable rows={[row({ status: "REVOKED" })]} meta={meta} pageHref={pageHref} />);

    expect(screen.getByText("050/PSIKOTES/YM/XI/2026").closest("a")).toBeNull();
    expect(screen.getByText("Tidak berlaku")).toBeTruthy();
  });
});
