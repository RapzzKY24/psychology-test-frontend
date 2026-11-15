// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TestReportContents } from "@/features/public/components/test-report-contents";

afterEach(cleanup);

describe("TestReportContents", () => {
  it("names the four things the report contains", () => {
    render(<TestReportContents />);

    expect(screen.getByRole("heading", { name: "Apa yang Anda dapat" })).toBeTruthy();
    for (const title of [
      "Identitas & nomor laporan",
      "Skor tiap aspek",
      "Kesimpulan tertulis",
      "Tanda tangan & QR",
    ]) {
      expect(screen.getByText(title)).toBeTruthy();
    }
  });

  it("labels the preview as a sample and hides the mock from screen readers", () => {
    render(<TestReportContents />);

    expect(screen.getByText(/Contoh halaman laporan/)).toBeTruthy();
    // The mock is decorative: the caption and the list carry the meaning.
    const mock = document.querySelector('[aria-hidden="true"]');
    expect(mock?.textContent).toContain("Laporan Hasil");
  });
});
