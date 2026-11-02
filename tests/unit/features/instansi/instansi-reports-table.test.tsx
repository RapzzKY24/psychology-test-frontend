// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { InstansiReportsTable } from "@/features/instansi/reports/components/instansi-reports-table";
import type { InstansiReportItem } from "@/lib/api/types";

vi.mock("@/features/instansi/reports/hooks/use-download-instansi-report-pdf", () => ({
  useDownloadInstansiReportPdf: () => ({ isPending: false, mutate: vi.fn() }),
}));

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
const pageHref = (page: number) => `/instansi/laporan?page=${page}`;

function row(overrides: Partial<InstansiReportItem> = {}): InstansiReportItem {
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

describe("InstansiReportsTable", () => {
  it("shows the empty state when no report has been issued", () => {
    render(<InstansiReportsTable rows={[]} meta={{ ...meta, total: 0 }} pageHref={pageHref} />);

    expect(screen.getByText("Belum ada laporan")).toBeTruthy();
  });

  it("offers a download action for an active report", () => {
    render(<InstansiReportsTable rows={[row()]} meta={meta} pageHref={pageHref} />);

    expect(screen.getByText("050/PSIKOTES/YM/XI/2026")).toBeTruthy();
    expect(screen.getByText("Budi Santoso")).toBeTruthy();
    expect(screen.getByText("Terbit")).toBeTruthy();
    expect(screen.getByText("Unduh PDF")).toBeTruthy();
  });

  it("hides the download action once a report is revoked", () => {
    render(
      <InstansiReportsTable rows={[row({ status: "REVOKED" })]} meta={meta} pageHref={pageHref} />,
    );

    expect(screen.getByText("Dibatalkan")).toBeTruthy();
    expect(screen.queryByText("Unduh PDF")).toBeNull();
    expect(screen.getByText("Tidak berlaku")).toBeTruthy();
  });

  it("marks a revision above one", () => {
    render(<InstansiReportsTable rows={[row({ revision: 2 })]} meta={meta} pageHref={pageHref} />);

    expect(screen.getByText("rev. 2")).toBeTruthy();
  });
});
