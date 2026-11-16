// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SertifikatCard } from "@/features/participant/components/sertifikat-card";
import type { MeCertificateItem } from "@/lib/api/types";

const { downloadFile } = vi.hoisted(() => ({ downloadFile: vi.fn() }));
vi.mock("@/lib/download", () => ({ downloadFile }));

afterEach(() => {
  cleanup();
  downloadFile.mockReset();
});

function certificate(overrides: Partial<MeCertificateItem> = {}): MeCertificateItem {
  return {
    id: "c1",
    number: "012/DISC/XI/2026",
    testName: "DISC Form A",
    issuedAt: "2026-11-16T09:00:00.000Z",
    validUntil: "2027-11-16T00:00:00.000Z",
    status: "ACTIVE",
    verifyCode: "AB12CD34",
    ...overrides,
  };
}

describe("SertifikatCard", () => {
  it("shows the number, dates and both actions for an active certificate", () => {
    render(<SertifikatCard certificate={certificate()} />);

    expect(screen.getByText("012/DISC/XI/2026")).toBeTruthy();
    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("Berlaku sampai")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Unduh PDF" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Halaman verifikasi/ }).getAttribute("href")).toBe(
      "/verifikasi-sertifikat/AB12CD34",
    );
  });

  it("keeps a revoked certificate visible but removes the download", () => {
    render(<SertifikatCard certificate={certificate({ status: "REVOKED" })} />);

    expect(screen.getByText("Dicabut")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Unduh PDF" })).toBeNull();
    expect(screen.getByText(/sudah dicabut/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Halaman verifikasi/ })).toBeTruthy();
  });

  it("hides the validity row when the certificate never expires", () => {
    render(<SertifikatCard certificate={certificate({ validUntil: null })} />);

    expect(screen.queryByText("Berlaku sampai")).toBeNull();
  });

  it("downloads the certificate through the participant endpoint", async () => {
    downloadFile.mockResolvedValue(undefined);
    render(<SertifikatCard certificate={certificate()} />);

    fireEvent.click(screen.getByRole("button", { name: "Unduh PDF" }));

    await waitFor(() =>
      expect(downloadFile).toHaveBeenCalledWith(
        "/me/certificates/c1/pdf",
        "sertifikat-012-DISC-XI-2026.pdf",
      ),
    );
  });
});
