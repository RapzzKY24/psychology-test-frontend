// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PembelianTable } from "@/features/participant/components/pembelian-table";
import type { MeOrderItem } from "@/lib/api/types";

vi.mock("@/features/checkout/api", () => ({
  fetchOrderDetail: vi.fn(),
  reconcileCheckoutStatus: vi.fn(),
  createOrder: vi.fn(),
}));

afterEach(cleanup);

function row(overrides: Partial<MeOrderItem>): MeOrderItem {
  return {
    id: "o1",
    testName: "IST",
    testSlug: "ist",
    amount: 75_000,
    status: "PENDING",
    createdAt: "2026-11-16T08:00:00.000Z",
    expiresAt: new Date(Date.now() + 42 * 60_000).toISOString(),
    paidAt: null,
    canPay: true,
    paymentUrl: "https://pay.doku.test/abc",
    ...overrides,
  };
}

const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

function renderTable(
  rows: MeOrderItem[],
  status?: MeOrderItem["status"],
  metaOverride: typeof meta = meta,
) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <PembelianTable rows={rows} meta={metaOverride} status={status} />
    </QueryClientProvider>,
  );
}

/** The list and the table both render the same action in jsdom. */
function hrefsOf(name: string): Array<string | null> {
  return [...new Set(screen.getAllByRole("link", { name }).map((l) => l.getAttribute("href")))];
}

describe("PembelianTable", () => {
  it("offers a payment action on a payable order", () => {
    renderTable([row({})]);

    expect(screen.getAllByRole("button", { name: "Bayar" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Menunggu bayar").length).toBeGreaterThan(0);
  });

  it("sends a paid order to the result history", () => {
    renderTable([row({ status: "PAID", canPay: false, paymentUrl: null, paidAt: "2026-11-16T09:00:00.000Z" })]);

    expect(hrefsOf("Lihat hasil")).toEqual(["/dashboard/riwayat"]);
  });

  it("lets an expired order be bought again from the test page", () => {
    renderTable([row({ status: "EXPIRED", canPay: false, paymentUrl: null })]);

    expect(hrefsOf("Beli lagi")).toEqual(["/tes/ist"]);
  });

  it("keeps the status filter in the pagination links", () => {
    renderTable([row({})], "PENDING", { ...meta, total: 12, totalPages: 2 });

    expect(hrefsOf("Berikutnya")).toEqual(["/dashboard/pembelian?page=2&status=PENDING"]);
  });

  it("explains an empty purchase history", () => {
    renderTable([]);

    expect(screen.getByText("Belum ada pembelian")).toBeTruthy();
  });
});
