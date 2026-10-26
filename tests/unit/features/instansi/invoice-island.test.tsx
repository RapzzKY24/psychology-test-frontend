// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { InvoiceIsland } from "@/features/instansi/invoices/components/invoice-island";
import { fetchInstansiInvoice } from "@/features/instansi/invoices/api";
import { fetchInstansiSessionDetail } from "@/features/instansi/sessions/api";
import type { InstansiInvoice } from "@/lib/api/types";

vi.mock("@/features/instansi/invoices/api", () => ({
  fetchInstansiInvoice: vi.fn(),
}));
vi.mock("@/features/instansi/sessions/api", () => ({
  fetchInstansiSessionDetail: vi.fn(),
}));

const mockFetchInvoice = vi.mocked(fetchInstansiInvoice);
const mockFetchSession = vi.mocked(fetchInstansiSessionDetail);

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const unpaid: InstansiInvoice = {
  id: "inv1",
  number: "INV-2026-0001",
  amount: 300000,
  status: "UNPAID",
  sessionId: "s1",
  vaNumber: "8801234567",
  vaBankCode: "014",
  paymentUrl: null,
  paymentToken: null,
  expiresAt: new Date(Date.now() + 3600_000).toISOString(),
};

/** Current provider shape: Snap hosted page, no VA fields. */
const snap: InstansiInvoice = {
  ...unpaid,
  vaNumber: null,
  vaBankCode: null,
  paymentUrl: "https://app.sandbox.midtrans.com/snap/v4/redirection/abc-123",
  paymentToken: "tok-snap",
};

const paid: InstansiInvoice = { ...unpaid, status: "PAID" };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("InvoiceIsland", () => {
  it("renders the VA, amount, and a copy action while UNPAID", () => {
    render(<InvoiceIsland initial={unpaid} />, { wrapper });

    expect(screen.getByText(/Rp\s?300\.000/)).toBeTruthy();
    expect(screen.getByText("8801234567")).toBeTruthy();
    expect(screen.getByText(/VA BCA/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Salin Nomor VA/ })).toBeTruthy();
    expect(screen.queryByText(/Sesi aktif/)).toBeNull();
  });

  it("links to the Snap hosted page when paymentUrl is present", () => {
    render(<InvoiceIsland initial={snap} />, { wrapper });

    const pay = screen.getByRole("link", { name: /Bayar Sekarang/ });
    expect(pay.getAttribute("href")).toBe(snap.paymentUrl);
    expect(pay.getAttribute("target")).toBe("_blank");
    expect(screen.queryByRole("button", { name: /Salin Nomor VA/ })).toBeNull();
  });

  it("hides the payment CTA and shares the invite link once PAID", async () => {
    mockFetchSession.mockResolvedValue({
      data: {
        session: { ...unpaid, id: "s1", token: "tok-abc", status: "ACTIVE" },
      },
    } as unknown as Awaited<ReturnType<typeof fetchInstansiSessionDetail>>);

    render(<InvoiceIsland initial={paid} />, { wrapper });

    expect(screen.queryByRole("button", { name: /Salin Nomor VA/ })).toBeNull();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Salin Link Peserta/ })).toBeTruthy(),
    );
    expect(mockFetchSession).toHaveBeenCalledWith("s1");
  });
});
