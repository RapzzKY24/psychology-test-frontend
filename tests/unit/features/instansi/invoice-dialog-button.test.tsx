// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { InvoiceDialogButton } from "@/features/instansi/sessions/components/invoice-dialog-button";
import type { InstansiSessionDetail } from "@/lib/api/types";

vi.mock("@/features/instansi/sessions/api", () => ({
  fetchInstansiSessionDetail: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const detail = (status: "UNPAID" | "PAID"): InstansiSessionDetail =>
  ({
    session: {
      id: "s1",
      title: "DISC Form A — PT Telkom",
      status: status === "PAID" ? "ACTIVE" : "PENDING_PAYMENT",
      slotLimit: 20,
      token: "tok",
      expiresAt: "2026-11-25T07:36:45.000Z",
    },
    participants: [],
    attempts: { total: 0, inProgress: 0, completed: 0 },
    tests: [],
    invoice: {
      id: "inv1",
      number: "INV-2026-0002",
      amount: 3750000,
      status,
      sessionId: "s1",
      vaNumber: null,
      vaBankCode: null,
      paymentUrl: null,
      paymentToken: null,
      expiresAt: "2026-10-27T07:36:45.000Z",
    },
  }) as unknown as InstansiSessionDetail;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("InvoiceDialogButton", () => {
  it("opens the invoice details in a dialog instead of a full card", async () => {
    render(<InvoiceDialogButton sessionId="s1" initial={detail("UNPAID")} />, { wrapper });

    expect(screen.queryByText("Tagihan INV-2026-0002")).toBeNull();
    // Unpaid is the primary action; paid falls back to a quiet outline button.
    const trigger = screen.getByRole("button", { name: /Pembayaran/ });
    expect(trigger.getAttribute("data-variant")).toBe("default");

    fireEvent.click(trigger);

    expect(await screen.findByText("Tagihan INV-2026-0002")).toBeTruthy();
    expect(screen.getByText(/Rp\s?3\.750\.000/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Bayar sekarang" }).getAttribute("href")).toBe(
      "/instansi/tagihan/inv1",
    );
  });

  it("shows the paid state and links to the payment detail", async () => {
    render(<InvoiceDialogButton sessionId="s1" initial={detail("PAID")} />, { wrapper });

    const trigger = screen.getByRole("button", { name: /Pembayaran/ });
    expect(trigger.getAttribute("data-variant")).toBe("outline");

    fireEvent.click(trigger);

    expect(await screen.findByRole("link", { name: "Lihat detail pembayaran" })).toBeTruthy();
    expect(screen.getByText("Dibayar")).toBeTruthy();
    expect(screen.queryByText(/Bayar sebelum/)).toBeNull();
  });
});
