// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { RiwayatTable } from "@/features/participant/components/riwayat-table";
import type { MeAttemptItem } from "@/lib/api/types";

afterEach(cleanup);

function row(overrides: Partial<MeAttemptItem>): MeAttemptItem {
  return {
    id: "a1",
    testId: "t1",
    testName: "DISC Form A",
    status: "COMPLETED",
    startedAt: "2026-11-16T08:00:00.000Z",
    completedAt: "2026-11-16T09:00:00.000Z",
    sessionId: "s1",
    sessionTitle: "Order abc",
    resultStatus: "PENDING_REVIEW",
    reviewNote: null,
    ...overrides,
  };
}

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

/** The list and the table both render the same action; jsdom ignores the
 * media query that hides one of them, so assert on the distinct targets. */
function hrefsOf(name: string): Array<string | null> {
  return [...new Set(screen.getAllByRole("link", { name }).map((l) => l.getAttribute("href")))];
}

describe("RiwayatTable", () => {
  it("sends an in-progress attempt back to the runner", () => {
    render(<RiwayatTable rows={[row({ status: "IN_PROGRESS" })]} meta={meta} />);

    expect(hrefsOf("Lanjutkan")).toEqual(["/tes/kerjakan/a1"]);
    expect(screen.getAllByText("Dikerjakan").length).toBeGreaterThan(0);
  });

  it("links an approved result", () => {
    render(<RiwayatTable rows={[row({ resultStatus: "APPROVED" })]} meta={meta} />);

    expect(hrefsOf("Lihat hasil")).toEqual(["/hasil/a1"]);
  });

  it("offers the psychologist's note when a result was returned", () => {
    render(
      <RiwayatTable
        rows={[row({ resultStatus: "RETURNED", reviewNote: "Ulangi bagian 2" })]}
        meta={meta}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Lihat catatan" }).length).toBeGreaterThan(0);
  });

  it("stays quiet on a returned result without a note", () => {
    render(<RiwayatTable rows={[row({ resultStatus: "RETURNED" })]} meta={meta} />);

    expect(screen.queryAllByRole("button", { name: "Lihat catatan" })).toEqual([]);
    expect(screen.getAllByText("Dikembalikan").length).toBeGreaterThan(0);
  });

  it("does not offer an action while the result waits for review", () => {
    render(<RiwayatTable rows={[row({})]} meta={meta} />);

    expect(screen.getAllByText("Menunggu review").length).toBeGreaterThan(0);
    expect(screen.queryAllByRole("link")).toEqual([]);
  });

  it("says the list is empty rather than showing a broken table", () => {
    render(<RiwayatTable rows={[]} meta={{ ...meta, total: 0, totalPages: 0 }} />);

    expect(screen.getByText("Belum ada tes")).toBeTruthy();
  });
});
