// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
  category: "PERSONALITY",
  price: 75000,
  estimatedDurationMin: 30,
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
    // 75.000 × 50 slots (DEFAULT_SLOT_LIMIT)
    expect(screen.getByText(/Rp\s?3\.750\.000/)).toBeTruthy();
  });

  it("explains when the test is not sellable instead of showing an empty form", () => {
    render(<SingleTestCheckout testId="missing" initialTests={[disc]} />, { wrapper });

    expect(screen.getByText("Tes tidak tersedia")).toBeTruthy();
    expect(screen.queryByLabelText("Jumlah slot")).toBeNull();
  });
});
