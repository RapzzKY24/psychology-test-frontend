// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { InvoicesTable } from "@/features/instansi/invoices/components/invoices-table";
import { formatIdr } from "@/lib/format/format-idr";
import type { InstansiInvoiceListItem } from "@/lib/api/types";

const row: InstansiInvoiceListItem = {
  id: "inv1",
  number: "INV-2026-0002",
  amount: 400000,
  status: "UNPAID",
  sessionId: "s1",
  sessionTitle: "DISC Form A",
  slotLimit: 50,
  vaNumber: null,
  vaBankCode: null,
  paymentUrl: "https://app.sandbox.midtrans.com/snap/v4/redirection/tok",
  paymentToken: "tok",
  expiresAt: "2099-01-01T00:00:00.000Z",
};

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
const pageHref = (page: number) => `/instansi/pembayaran?page=${page}`;

afterEach(cleanup);

describe("InvoicesTable", () => {
  it("renders the empty state when the institution has no invoice", () => {
    render(<InvoicesTable rows={[]} meta={{ ...meta, total: 0 }} pageHref={pageHref} />);

    expect(screen.getByText("Belum ada tagihan")).toBeTruthy();
  });

  it("shows the batch, amount, status and a pay action for an open invoice", () => {
    render(<InvoicesTable rows={[row]} meta={meta} pageHref={pageHref} />);

    expect(screen.getByText("INV-2026-0002")).toBeTruthy();
    expect(screen.getByText("DISC Form A")).toBeTruthy();
    expect(screen.getByText("50 peserta")).toBeTruthy();
    // `Intl` inserts a non-breaking space after "Rp".
    expect(screen.getByText(formatIdr(400000).replace(/\u00a0/g, " "))).toBeTruthy();
    expect(screen.getByText("Menunggu Pembayaran")).toBeTruthy();
    expect(screen.getByText("Bayar").closest("a")?.getAttribute("href")).toBe(
      "/instansi/tagihan/inv1",
    );
  });

  it("replaces the pay action with a disabled badge once the window closed", () => {
    render(
      <InvoicesTable
        rows={[{ ...row, expiresAt: "2020-01-01T00:00:00.000Z" }]}
        meta={meta}
        pageHref={pageHref}
      />,
    );

    expect(screen.getByRole("button", { name: "Kedaluwarsa" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByText("Bayar")).toBeNull();
  });

  it("offers only the detail link on a paid invoice", () => {
    render(
      <InvoicesTable
        rows={[{ ...row, status: "PAID", expiresAt: null }]}
        meta={meta}
        pageHref={pageHref}
      />,
    );

    expect(screen.getByText("Dibayar")).toBeTruthy();
    expect(screen.queryByText("Bayar")).toBeNull();
    expect(screen.getByText("Detail").closest("a")?.getAttribute("href")).toBe(
      "/instansi/tagihan/inv1",
    );
  });

  it("keeps an invoice without a session renderable", () => {
    render(
      <InvoicesTable
        rows={[{ ...row, sessionId: null, sessionTitle: null, slotLimit: null }]}
        meta={meta}
        pageHref={pageHref}
      />,
    );

    expect(screen.getByText("INV-2026-0002")).toBeTruthy();
    expect(screen.queryByText(/peserta/)).toBeNull();
  });
});
