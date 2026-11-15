// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LandingProofBand } from "@/features/public/components/landing-proof-band";

afterEach(cleanup);

describe("LandingProofBand", () => {
  it("prints the counts it was given, not a fixed claim", () => {
    render(<LandingProofBand stats={{ tests: 27, categories: 5, psychologists: 1 }} />);

    expect(screen.getByText("27")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("Tes tersedia")).toBeTruthy();
    expect(screen.getByText("Kategori")).toBeTruthy();
    expect(screen.getByText("Psikolog berlisensi")).toBeTruthy();
  });

  it("renders nothing when the counts could not be fetched", () => {
    const { container } = render(<LandingProofBand stats={null} />);

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing on an empty catalog instead of three zeroes", () => {
    const { container } = render(
      <LandingProofBand stats={{ tests: 0, categories: 0, psychologists: 0 }} />,
    );

    expect(container.innerHTML).toBe("");
  });
});
