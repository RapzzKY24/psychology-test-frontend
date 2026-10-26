// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CheckoutResult } from "@/features/checkout/components/checkout-result";
import { reconcileCheckoutStatus } from "@/features/checkout/api";
import type { CheckoutStatusResult } from "@/lib/api/types";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/features/checkout/api", () => ({
  fetchCheckoutStatus: vi.fn(),
  reconcileCheckoutStatus: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const invoice: CheckoutStatusResult = {
  kind: "invoice",
  id: "inv1",
  status: "PAID",
  amount: 400000,
  testNames: ["DISC Form A"],
  sessionId: "sess1",
  paidAt: "2026-10-26T07:37:22.000Z",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CheckoutResult", () => {
  it("confirms a paid invoice and links to the roster", () => {
    render(<CheckoutResult initial={invoice} />, { wrapper });

    expect(screen.getByText("Pembayaran berhasil")).toBeTruthy();
    expect(screen.getByText("DISC Form A")).toBeTruthy();
    expect(screen.getByText(/Rp\s?400\.000/)).toBeTruthy();
    const cta = screen.getByRole("link", { name: "Isi peserta sekarang" });
    expect(cta.getAttribute("href")).toBe("/instansi/sesi/sess1");
  });

  it("never claims success from the Snap hint alone", () => {
    render(
      <CheckoutResult initial={{ ...invoice, status: "UNPAID", paidAt: null }} hint="settlement" />,
      { wrapper },
    );

    expect(screen.getByText("Pembayaran diterima — sedang diverifikasi")).toBeTruthy();
    expect(screen.queryByText("Pembayaran berhasil")).toBeNull();
  });

  it("offers a gateway check instead of a second dashboard button while verifying", () => {
    render(
      <CheckoutResult initial={{ ...invoice, status: "UNPAID", paidAt: null }} hint="settlement" />,
      { wrapper },
    );

    expect(screen.getByRole("button", { name: /Cek status sekarang/ })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "Ke dashboard" })).toHaveLength(1);
  });

  it("points an unpaid invoice back to its payment page", () => {
    render(<CheckoutResult initial={{ ...invoice, status: "UNPAID", paidAt: null }} />, {
      wrapper,
    });

    expect(screen.getByText("Menunggu pembayaran")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Lihat tagihan" }).getAttribute("href")).toBe(
      "/instansi/tagihan/inv1",
    );
  });

  it("checks the gateway once when an unpaid checkout is opened", async () => {
    vi.mocked(reconcileCheckoutStatus).mockResolvedValue({
      data: { ...invoice, status: "PAID", paidAt: "2026-10-26T07:53:51.000Z" },
      meta: undefined,
    } as never);

    render(<CheckoutResult initial={{ ...invoice, status: "UNPAID", paidAt: null }} />, {
      wrapper,
    });

    await waitFor(() => expect(reconcileCheckoutStatus).toHaveBeenCalledWith("inv1"));
    expect(reconcileCheckoutStatus).toHaveBeenCalledTimes(1);
    // The patched status replaces the stale one without a manual reload.
    await waitFor(() => expect(screen.getByText("Pembayaran berhasil")).toBeTruthy());
  });

  it("does not ask the gateway about a checkout that is already final", () => {
    render(<CheckoutResult initial={invoice} />, { wrapper });

    expect(reconcileCheckoutStatus).not.toHaveBeenCalled();
  });

  it("reports a cancelled payment as failed", () => {
    render(<CheckoutResult initial={{ ...invoice, status: "CANCELLED", paidAt: null }} />, {
      wrapper,
    });

    expect(screen.getByText("Pembayaran tidak berhasil")).toBeTruthy();
  });

  it("sends a paid personal order to the dashboard", () => {
    render(
      <CheckoutResult
        initial={{
          kind: "order",
          id: "ord1",
          status: "PAID",
          amount: 75000,
          testNames: ["DISC Form A"],
          sessionId: null,
          paidAt: "2026-10-26T07:37:22.000Z",
        }}
      />,
      { wrapper },
    );

    expect(screen.getByRole("link", { name: "Mulai tes" }).getAttribute("href")).toBe("/dashboard");
  });
});
