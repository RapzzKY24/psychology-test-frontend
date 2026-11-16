// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaymentDialog } from "@/features/checkout/components/payment-dialog";
import type { OrderDetail } from "@/lib/api/types";

const { fetchOrderDetail } = vi.hoisted(() => ({ fetchOrderDetail: vi.fn() }));

vi.mock("@/features/checkout/api", () => ({
  fetchOrderDetail,
  reconcileCheckoutStatus: vi.fn(),
  createOrder: vi.fn(),
}));

afterEach(() => {
  cleanup();
  fetchOrderDetail.mockReset();
});

const base: OrderDetail = {
  id: "o1",
  status: "PENDING",
  amount: 75_000,
  basePrice: 75_000,
  uniqueCode: 0,
  expiresAt: new Date(Date.now() + 42 * 60_000).toISOString(),
  secondsRemaining: 2520,
  userClaimedAt: null,
  paymentProvider: "DOKU_CHECKOUT",
  qrisImageUrl: null,
  vaNumber: null,
  vaBankCode: null,
  paymentUrl: null,
  paymentToken: null,
  attempt: null,
};

function renderDialog(order: OrderDetail = base) {
  fetchOrderDetail.mockResolvedValue({ data: order });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PaymentDialog orderId="o1" testName="IST" onClose={() => {}} />
    </QueryClientProvider>,
  );
}

describe("PaymentDialog", () => {
  it("sends the buyer to the hosted payment page", async () => {
    renderDialog({ ...base, paymentUrl: "https://pay.doku.test/abc" });

    const link = await screen.findByRole("link", { name: /Lanjut ke Pembayaran/ });
    expect(link.getAttribute("href")).toBe("https://pay.doku.test/abc");
    expect(screen.getByText(/75\.000/)).toBeTruthy();
  });

  it("shows the virtual account number with its bank", async () => {
    renderDialog({ ...base, vaNumber: "7001234567890", vaBankCode: "bca" });

    expect(await screen.findByText("7001234567890")).toBeTruthy();
    expect(screen.getByText(/Virtual Account BCA/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Salin Nomor VA/ })).toBeTruthy();
  });

  it("shows the merchant QRIS image", async () => {
    renderDialog({ ...base, qrisImageUrl: "/uploads/qris/merchant.png" });

    const img = (await screen.findByAltText("Kode QRIS pembayaran")) as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/uploads/qris/merchant.png");
  });

  it("confirms a settled order and points to the dashboard when nothing is linked", async () => {
    renderDialog({ ...base, status: "PAID", attempt: null });

    expect(await screen.findByText(/Pembayaran diterima/)).toBeTruthy();
    const link = screen.getByRole("link", { name: "Buka Dashboard" });
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("sends a paid order straight to the work", async () => {
    renderDialog({
      ...base,
      status: "PAID",
      attempt: { id: "a1", status: "IN_PROGRESS", resultStatus: null },
    });

    const link = await screen.findByRole("link", { name: "Kerjakan Sekarang" });
    expect(link.getAttribute("href")).toBe("/tes/kerjakan/a1");
  });

  it("sends a paid order with an approved result to the result page", async () => {
    renderDialog({
      ...base,
      status: "PAID",
      attempt: { id: "a1", status: "COMPLETED", resultStatus: "APPROVED" },
    });

    const link = await screen.findByRole("link", { name: "Lihat Hasil" });
    expect(link.getAttribute("href")).toBe("/hasil/a1");
  });

  it("explains an expired window instead of offering a payment", async () => {
    renderDialog({ ...base, status: "EXPIRED" });

    expect(await screen.findByText(/Waktu pembayaran sudah lewat/)).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Lanjut ke Pembayaran/ })).toBeNull();
  });
});
