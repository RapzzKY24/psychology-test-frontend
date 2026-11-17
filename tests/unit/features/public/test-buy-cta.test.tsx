// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TestBuyCta } from "@/features/public/components/test-buy-cta";

afterEach(cleanup);

function renderCta(role: "PARTICIPANT" | "INSTANSI" | null) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <TestBuyCta testId="t1" testName="IST" testSlug="ist" role={role} />
    </QueryClientProvider>,
  );
}

describe("TestBuyCta", () => {
  it("sends a signed-out visitor to sign in and back to this test", () => {
    renderCta(null);
    const link = screen.getByRole("link", { name: "Mulai Tes" });
    expect(link.getAttribute("href")).toBe("/masuk?next=%2Ftes%2Fist");
  });

  it("sends an institution to the batch checkout with the test preselected", () => {
    renderCta("INSTANSI");
    const link = screen.getByRole("link", { name: /Pesan Sesi/ });
    expect(link.getAttribute("href")).toBe("/instansi/buat-sesi?testId=t1");
  });

  it("offers a personal checkout to a participant", () => {
    renderCta("PARTICIPANT");
    expect(screen.getByRole("button", { name: "Mulai Tes" })).toBeTruthy();
  });
});
