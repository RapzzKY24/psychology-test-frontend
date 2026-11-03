// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { InvoiceIsland } from "@/features/instansi/invoices/components/invoice-island";
import {
  fetchInstansiInvoice,
  retryInstansiInvoicePayment,
} from "@/features/instansi/invoices/api";
import { fetchInstansiSessionDetail } from "@/features/instansi/sessions/api";
import type { InstansiInvoice } from "@/lib/api/types";
import { INVOICE_RETRY_AFTER_MS } from "@/features/instansi/invoices/constants";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/instansi/invoices/api", () => ({
  fetchInstansiInvoice: vi.fn(),
  retryInstansiInvoicePayment: vi.fn(),
}));
vi.mock("@/features/instansi/sessions/api", () => ({
  fetchInstansiSessionDetail: vi.fn(),
}));

const mockFetchInvoice = vi.mocked(fetchInstansiInvoice);
const mockRetryPayment = vi.mocked(retryInstansiInvoicePayment);
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
  vi.useRealTimers();
  push.mockClear();
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

  it("does not redirect when the invoice was already PAID on arrival", () => {
    render(<InvoiceIsland initial={paid} />, { wrapper });

    expect(push).not.toHaveBeenCalled();
  });

  it("offers a retry once the payment link has not arrived", async () => {
    // Provisioning failed (gateway down): no link, no VA, still UNPAID.
    const pending: InstansiInvoice = {
      ...unpaid,
      vaNumber: null,
      vaBankCode: null,
      paymentUrl: null,
    };
    mockFetchInvoice.mockResolvedValue({
      data: pending,
    } as unknown as Awaited<ReturnType<typeof fetchInstansiInvoice>>);
    mockRetryPayment.mockResolvedValue({
      data: { ...pending, paymentUrl: "https://api-sandbox.doku.com/checkout/abc" },
    } as unknown as Awaited<ReturnType<typeof retryInstansiInvoicePayment>>);

    vi.useFakeTimers();
    render(<InvoiceIsland initial={pending} />, { wrapper });

    // Still "being created" on arrival — a retry button now would invite spam.
    expect(screen.queryByRole("button", { name: /Coba lagi/ })).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(INVOICE_RETRY_AFTER_MS);
    });

    fireEvent.click(screen.getByRole("button", { name: /Coba lagi/ }));

    await act(async () => {});
    expect(mockRetryPayment).toHaveBeenCalledWith("inv1");
  });
});
