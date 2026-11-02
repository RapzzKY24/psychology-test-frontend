// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ReportVerificationCard } from "@/features/public/components/report-verification-card";

const active = {
  valid: true,
  number: "050/PSIKOTES/YM/XI/2026",
  revision: 1,
  status: "ACTIVE" as const,
  holderName: "Budi S.",
  sessionTitle: "CPMI Batch November",
  issuedAt: "2026-11-02T08:21:00.000Z",
  recommendation: "LAYAK" as const,
};

afterEach(cleanup);

describe("ReportVerificationCard", () => {
  it("says the document is unknown when the code is not registered", () => {
    render(<ReportVerificationCard report={{ valid: false }} />);

    expect(screen.getByText("Dokumen tidak ditemukan")).toBeTruthy();
    expect(screen.queryByText("Nomor Laporan")).toBeNull();
  });

  it("shows the number, masked holder and recommendation for a valid report", () => {
    render(<ReportVerificationCard report={active} />);

    expect(screen.getByText("Dokumen tervalidasi")).toBeTruthy();
    expect(screen.getByText("050/PSIKOTES/YM/XI/2026")).toBeTruthy();
    expect(screen.getByText("Budi S.")).toBeTruthy();
    expect(screen.getByText("Layak")).toBeTruthy();
    expect(screen.getByText("Terbit")).toBeTruthy();
  });

  it("hides the recommendation once the report is cancelled", () => {
    render(
      <ReportVerificationCard
        report={{
          ...active,
          status: "REVOKED",
          recommendation: undefined,
          revokedAt: "2026-11-03T02:00:00.000Z",
          revokeReason: "salah input nilai",
        }}
      />,
    );

    expect(screen.getByText("Dokumen dibatalkan")).toBeTruthy();
    expect(screen.getByText("salah input nilai")).toBeTruthy();
    expect(screen.queryByText("Rekomendasi")).toBeNull();
  });

  it("labels a revision above one", () => {
    render(<ReportVerificationCard report={{ ...active, revision: 2 }} />);

    expect(screen.getByText("ke-2")).toBeTruthy();
  });
});
