// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SingleTestCheckout } from "@/features/instansi/sessions/components/single-test-checkout";
import type { InstansiTestOption } from "@/features/instansi/sessions/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const disc: InstansiTestOption = {
  id: "t-disc",
  slug: "disc-form-a",
  name: "DISC Form A",
  description: "Tes kepribadian",
  imageUrl: null,
  category: "PERSONALITY",
  price: 75000,
  estimatedDurationMin: 30,
  ageBand: null,
};

const cpmi: InstansiTestOption = {
  ...disc,
  id: "t-cpmi",
  slug: "cpmi",
  name: "CPMI",
  price: 20000,
};

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SingleTestCheckout", () => {
  it("locks the checkout to the test picked in the catalog", () => {
    render(<SingleTestCheckout testId="t-disc" initialTests={[disc, cpmi]} />, { wrapper });

    expect(screen.getByText("DISC Form A")).toBeTruthy();
    expect(screen.queryByText("CPMI")).toBeNull();
  });

  it("starts with an empty seat count and a disabled submit", () => {
    render(<SingleTestCheckout testId="t-disc" initialTests={[disc]} />, { wrapper });

    const slots = screen.getByLabelText("Jumlah slot") as HTMLInputElement;
    expect(slots.value).toBe("");
    expect(screen.getByText(/Rp\s?0$/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Buat Sesi/ }).hasAttribute("disabled")).toBe(true);
  });

  it("totals the price times the seats the institution typed", () => {
    render(<SingleTestCheckout testId="t-disc" initialTests={[disc]} />, { wrapper });

    fireEvent.change(screen.getByLabelText("Jumlah slot"), { target: { value: "50" } });

    expect(screen.getByText(/Rp\s?3\.750\.000/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Buat Sesi/ }).hasAttribute("disabled")).toBe(false);
  });

  it("explains a test whose price is not set instead of leaving a dead button", () => {
    const free: InstansiTestOption = { ...disc, id: "t-free", price: 0 };
    render(<SingleTestCheckout testId="t-free" initialTests={[free]} />, { wrapper });

    fireEvent.change(screen.getByLabelText("Jumlah slot"), { target: { value: "20" } });

    expect(screen.getByRole("alert").textContent).toContain("Harga tes ini belum diset");
    expect(screen.getByRole("button", { name: /Buat Sesi/ }).hasAttribute("disabled")).toBe(true);
  });

  it("explains when the test is not sellable instead of showing an empty form", () => {
    render(<SingleTestCheckout testId="missing" initialTests={[disc]} />, { wrapper });

    expect(screen.getByText("Tes tidak tersedia")).toBeTruthy();
    expect(screen.queryByLabelText("Jumlah slot")).toBeNull();
  });
});
