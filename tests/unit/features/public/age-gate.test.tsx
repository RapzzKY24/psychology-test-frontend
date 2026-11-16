// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AgeGateCard, AgeGateProvider } from "@/features/public/components/age-gate";
import { TestBuyCta } from "@/features/public/components/test-buy-cta";
import type { AgeBand } from "@/lib/age";

const CFIT2: AgeBand = { minMonths: 168, maxMonths: 179 };

afterEach(cleanup);

function isoYearsAgo(years: number): string {
  const date = new Date();
  date.setDate(1);
  date.setFullYear(date.getFullYear() - years);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function renderGate(band: AgeBand | null = CFIT2) {
  return render(
    <AgeGateProvider band={band}>
      <AgeGateCard role={null} />
      <TestBuyCta testId="t1" testName="IST" role={null} />
    </AgeGateProvider>,
  );
}

describe("AgeGateCard", () => {
  it("shows the band and keeps the buy button shut until a birth date is entered", () => {
    renderGate();
    expect(screen.getByText(/14 tahun 0 bulan – 14 tahun 11 bulan/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Isi tanggal lahir dulu/ }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("opens the button for an age inside the band", () => {
    renderGate();
    fireEvent.change(screen.getByLabelText(/Tanggal lahir peserta/), {
      target: { value: isoYearsAgo(14) },
    });
    expect(screen.getByText(/sesuai dengan norma tes ini/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mulai Tes" })).toBeTruthy();
  });

  it("blocks a participant below the band and says why", () => {
    renderGate();
    fireEvent.change(screen.getByLabelText(/Tanggal lahir peserta/), {
      target: { value: isoYearsAgo(13) },
    });
    expect(screen.getByText(/di bawah rentang norma/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Usia tidak sesuai norma/ }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("blocks a participant above the band", () => {
    renderGate();
    fireEvent.change(screen.getByLabelText(/Tanggal lahir peserta/), {
      target: { value: isoYearsAgo(16) },
    });
    expect(screen.getByText(/di atas rentang norma/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Usia tidak sesuai norma/ }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("renders nothing when the test has no age band", () => {
    renderGate(null);
    expect(screen.queryByLabelText(/Tanggal lahir peserta/)).toBeNull();
    expect(screen.getByRole("link", { name: "Mulai Tes" })).toBeTruthy();
  });

  it("gives institutions the note without a gate", () => {
    render(
      <AgeGateProvider band={CFIT2}>
        <AgeGateCard role="INSTANSI" />
        <TestBuyCta testId="t1" testName="IST" role="INSTANSI" />
      </AgeGateProvider>,
    );
    expect(screen.getByText(/Pastikan seluruh peserta/)).toBeTruthy();
    expect(screen.queryByLabelText(/Tanggal lahir peserta/)).toBeNull();
    expect(screen.getByRole("link", { name: /Pesan Sesi/ })).toBeTruthy();
  });
});
