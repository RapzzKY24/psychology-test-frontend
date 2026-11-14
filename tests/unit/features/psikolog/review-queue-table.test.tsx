// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ReviewQueueTable } from "@/features/psikolog/review/components/review-queue-table";
import type { ReviewListItem } from "@/lib/api/types";

const baseRow: ReviewListItem = {
  resultId: "r1",
  testName: "DISC",
  sessionTitle: "Sesi 1",
  participantName: "Budi Santoso",
  participantEmail: "budi@example.com",
  institutionName: "RS Harapan",
  scores: { graph: { D: 10, I: 5, S: 3, C: 2 } },
  patternCode: "DISC-D",
  completedAt: "2026-09-14T00:00:00.000Z",
  status: "PENDING_REVIEW",
  reviewNote: null,
};

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

afterEach(() => cleanup());

describe("ReviewQueueTable", () => {
  it("renders 7 headers", () => {
    render(<ReviewQueueTable rows={[baseRow]} meta={meta} />);
    expect(screen.getByText("Peserta")).toBeTruthy();
    expect(screen.getByText("Institusi")).toBeTruthy();
    expect(screen.getByText("Tes")).toBeTruthy();
    expect(screen.getByText("Skor")).toBeTruthy();
    expect(screen.getByText("Selesai")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByText("Aksi")).toBeTruthy();
  });

  it("shows Rilis Hasil disabled with title when APPROVED", () => {
    const approved: ReviewListItem = { ...baseRow, status: "APPROVED" };
    render(<ReviewQueueTable rows={[approved]} meta={meta} status="APPROVED" />);
    const btns = screen.getAllByRole("button", { name: "Rilis Hasil" });
    expect(btns.length).toBeGreaterThan(0);
    for (const btn of btns) {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
      expect(btn.getAttribute("aria-disabled")).toBe("true");
      expect(btn.getAttribute("title")).toBe("Segera hadir — hold");
      expect(btn.closest("span")?.getAttribute("title")).toBe("Segera hadir — hold");
    }
    expect(screen.getAllByText("Detail").length).toBeGreaterThan(0);
  });

  it("shows Tinjau for PENDING_REVIEW", () => {
    render(<ReviewQueueTable rows={[baseRow]} meta={meta} />);
    expect(screen.getAllByText("Tinjau").length).toBeGreaterThan(0);
    expect(screen.queryByText("Rilis Hasil")).toBeNull();
  });

  it("renders — and no title when institution is null", () => {
    const noInst: ReviewListItem = { ...baseRow, institutionName: null };
    const { container } = render(<ReviewQueueTable rows={[noInst]} meta={meta} />);
    const dashes = Array.from(container.querySelectorAll("td")).filter(
      (el) => el.textContent === "—",
    );
    expect(dashes.length).toBeGreaterThan(0);
    for (const el of dashes) {
      expect(el.getAttribute("title")).toBeNull();
    }
  });
});
