// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PendingReportsTable } from "@/features/psikolog/reports/components/pending-reports-table";

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
const pageHref = (page: number) => `/psikolog/laporan?pendingPage=${page}`;

afterEach(cleanup);

describe("PendingReportsTable", () => {
  it("shows the empty state when nobody is waiting", () => {
    render(<PendingReportsTable rows={[]} meta={{ ...meta, total: 0 }} pageHref={pageHref} />);

    expect(screen.getByText("Tidak ada peserta yang menunggu laporan")).toBeTruthy();
  });

  it("links a waiting participant straight to the form", () => {
    render(
      <PendingReportsTable
        rows={[
          {
            participantId: "p1",
            participantName: "Budi Santoso",
            sessionId: "s1",
            sessionTitle: "Psikotes Batch November",
            testsApproved: 2,
            testsTotal: 2,
          },
        ]}
        meta={meta}
        pageHref={pageHref}
      />,
    );

    expect(screen.getByText("Budi Santoso")).toBeTruthy();
    expect(screen.getByText("2/2")).toBeTruthy();
    expect(screen.getByText("Buat Laporan").closest("a")?.getAttribute("href")).toBe(
      "/psikolog/laporan/p1",
    );
  });
});
