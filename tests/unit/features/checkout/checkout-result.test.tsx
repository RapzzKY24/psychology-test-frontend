// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CheckoutResult } from "@/features/checkout/components/checkout-result";
import type { CheckoutStatusResult } from "@/lib/api/types";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/features/checkout/api", () => ({
  fetchCheckoutStatus: vi.fn(),
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

  it("points an unpaid invoice back to its payment page", () => {
    render(<CheckoutResult initial={{ ...invoice, status: "UNPAID", paidAt: null }} />, {
      wrapper,
    });

    expect(screen.getByText("Menunggu pembayaran")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Lihat tagihan" }).getAttribute("href")).toBe(
      "/instansi/tagihan/inv1",
    );
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
