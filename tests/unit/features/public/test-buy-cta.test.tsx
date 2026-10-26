// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TestBuyCta } from "@/features/public/components/test-buy-cta";

afterEach(cleanup);

describe("TestBuyCta", () => {
  it("sends a signed-out visitor to sign in", () => {
    render(<TestBuyCta testId="t1" role={null} />);
    const link = screen.getByRole("link", { name: "Beli Tes" });
    expect(link.getAttribute("href")).toBe("/masuk");
  });

  it("sends an institution to the batch checkout with the test preselected", () => {
    render(<TestBuyCta testId="t1" role="INSTANSI" />);
    const link = screen.getByRole("link", { name: /Beli & Bayar/ });
    expect(link.getAttribute("href")).toBe("/instansi/buat-sesi?testId=t1");
  });

  it("sends a participant to the dashboard", () => {
    render(<TestBuyCta testId="t1" role="PARTICIPANT" />);
    const link = screen.getByRole("link", { name: "Mulai Tes" });
    expect(link.getAttribute("href")).toBe("/dashboard");
  });
});
