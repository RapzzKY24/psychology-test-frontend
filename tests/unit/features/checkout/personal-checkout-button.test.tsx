// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersonalCheckoutButton } from "@/features/checkout/components/personal-checkout-button";
import type { CreateOrderResult, OrderDetail } from "@/lib/api/types";

const { createOrder, fetchOrderDetail } = vi.hoisted(() => ({
  createOrder: vi.fn(),
  fetchOrderDetail: vi.fn(),
}));

vi.mock("@/features/checkout/api", () => ({
  createOrder,
  fetchOrderDetail,
  reconcileCheckoutStatus: vi.fn(),
}));

afterEach(() => {
  cleanup();
  createOrder.mockReset();
  fetchOrderDetail.mockReset();
});

const created: CreateOrderResult = {
  orderId: "o1",
  basePrice: 75_000,
  uniqueCode: 0,
  amount: 75_000,
  expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
  qrisImageUrl: null,
  paymentProvider: "DOKU_CHECKOUT",
  vaNumber: null,
  vaBankCode: null,
  paymentUrl: "https://pay.doku.test/abc",
  paymentToken: null,
};

const detail: OrderDetail = {
  id: "o1",
  status: "PENDING",
  amount: 75_000,
  basePrice: 75_000,
  uniqueCode: 0,
  expiresAt: created.expiresAt,
  secondsRemaining: 3600,
  userClaimedAt: null,
  paymentProvider: "DOKU_CHECKOUT",
  qrisImageUrl: null,
  vaNumber: null,
  vaBankCode: null,
  paymentUrl: created.paymentUrl,
  paymentToken: null,
  attempt: null,
};

function renderButton() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PersonalCheckoutButton testId="t1" testName="IST" />
    </QueryClientProvider>,
  );
}

describe("PersonalCheckoutButton", () => {
  it("creates the order on click and opens the payment dialog", async () => {
    createOrder.mockResolvedValue({ data: created });
    fetchOrderDetail.mockResolvedValue({ data: detail });

    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Mulai Tes" }));

    await waitFor(() => expect(createOrder).toHaveBeenCalledWith("t1"));
    expect(await screen.findByText("Pembayaran IST")).toBeTruthy();
    expect(fetchOrderDetail).toHaveBeenCalledWith("o1");
  });

  it("does not create an order until the buyer clicks", () => {
    renderButton();
    expect(createOrder).not.toHaveBeenCalled();
  });
});
