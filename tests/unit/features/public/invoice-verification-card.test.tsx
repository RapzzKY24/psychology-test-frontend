// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { InvoiceVerificationCard } from "@/features/public/components/invoice-verification-card";
import type { InvoiceVerification } from "@/lib/api/types";

afterEach(() => cleanup());

const base: InvoiceVerification = {
  number: "INV-2026-0001",
  institutionName: "PT Contoh Sejahtera",
  amount: 1500000,
  status: "UNPAID",
  issuedAt: "2026-10-28T03:00:00.000Z",
  dueDate: "2026-11-04T03:00:00.000Z",
  paidAt: null,
  payment: { bank: "BCA", vaNumber: "8808123456789012" },
};

describe("InvoiceVerificationCard", () => {
  it("shows the VA while the invoice is unpaid", () => {
    render(<InvoiceVerificationCard invoice={base} />);

    expect(screen.getByText("Dokumen tervalidasi")).toBeTruthy();
    expect(screen.getByText("BCA — 8808123456789012")).toBeTruthy();
    expect(screen.getByText("Belum Dibayar")).toBeTruthy();
    expect(screen.queryByText("Tanggal Bayar")).toBeNull();
  });

  it("hides the VA and shows the payment date once paid", () => {
    render(
      <InvoiceVerificationCard
        invoice={{
          ...base,
          status: "PAID",
          paidAt: "2026-10-29T02:00:00.000Z",
          payment: null,
        }}
      />,
    );

    expect(screen.getByText("Lunas")).toBeTruthy();
    expect(screen.queryByText("Nomor Virtual Account")).toBeNull();
    expect(screen.getByText("Tanggal Bayar")).toBeTruthy();
  });

  it("warns when the invoice is cancelled", () => {
    render(
      <InvoiceVerificationCard
        invoice={{ ...base, status: "CANCELLED", payment: null }}
      />,
    );

    expect(screen.getByText("Dokumen dibatalkan")).toBeTruthy();
    expect(
      screen.getByText("Invoice ini sudah dibatalkan dan tidak boleh dibayar."),
    ).toBeTruthy();
  });
});
