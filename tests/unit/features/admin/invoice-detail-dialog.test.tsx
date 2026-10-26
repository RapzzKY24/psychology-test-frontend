// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { InvoiceDetailDialog } from "@/features/admin/invoices/components/invoice-detail-dialog";
import { fetchInvoiceDetail } from "@/features/admin/invoices/api";
import type { AdminInvoiceDetail } from "@/lib/api/types";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/features/admin/invoices/api", () => ({
  fetchInvoices: vi.fn(),
  fetchInvoiceDetail: vi.fn(),
  createInvoice: vi.fn(),
  updateInvoiceStatus: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const detail: AdminInvoiceDetail = {
  id: "inv1",
  number: "INV-2026-0002",
  status: "PAID",
  amount: 400000,
  issuedAt: "2026-10-26T07:36:45.000Z",
  dueDate: null,
  expiresAt: "2026-10-27T07:36:45.000Z",
  paidAt: "2026-10-26T07:53:51.000Z",
  verifiedBySource: "MIDTRANS",
  paymentType: "bank_transfer",
  notes: null,
  institution: { id: "inst1", name: "PT Contoh Sejahtera" },
  session: {
    id: "s1",
    title: "Rekrutmen Batch Oktober",
    slotLimit: 50,
    status: "ACTIVE",
    testNames: ["DISC Form A", "CPMI"],
  },
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("InvoiceDetailDialog", () => {
  it("shows what was bought, for how much, and by which institution", async () => {
    vi.mocked(fetchInvoiceDetail).mockResolvedValue({ data: detail } as never);

    render(<InvoiceDetailDialog invoiceId="inv1" onClose={() => undefined} />, { wrapper });

    expect(await screen.findByText("INV-2026-0002")).toBeTruthy();
    expect(fetchInvoiceDetail).toHaveBeenCalledWith("inv1");
    expect(screen.getByText("PT Contoh Sejahtera")).toBeTruthy();
    expect(screen.getByText("DISC Form A")).toBeTruthy();
    expect(screen.getByText("CPMI")).toBeTruthy();
    expect(screen.getByText("Rekrutmen Batch Oktober · 50 peserta")).toBeTruthy();
    expect(screen.getByText(/Rp\s?400\.000/)).toBeTruthy();
    expect(screen.getByText("Dibayar")).toBeTruthy();
    expect(screen.getByText("Midtrans")).toBeTruthy();
  });

  it("does not request anything while no row is open", () => {
    render(<InvoiceDetailDialog invoiceId={null} onClose={() => undefined} />, { wrapper });

    expect(fetchInvoiceDetail).not.toHaveBeenCalled();
  });

  it("reports a failed request instead of an empty popup", async () => {
    vi.mocked(fetchInvoiceDetail).mockRejectedValue(new Error("boom"));

    render(<InvoiceDetailDialog invoiceId="inv1" onClose={() => undefined} />, { wrapper });

    expect(await screen.findByText("Gagal memuat rincian invoice.")).toBeTruthy();
  });
});
