// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LandingTestsBand } from "@/features/public/components/landing-tests-band";
import type { PublicTest } from "@/lib/api/types";

afterEach(cleanup);

const test: PublicTest = {
  id: "t1",
  slug: "disc",
  name: "Tes DISC",
  description: "Mengukur gaya kerja dan komunikasi.",
  imageUrl: null,
  category: "WORK_STYLE",
  price: 150000,
  estimatedDurationMin: 15,
  ageBand: null,
};

describe("LandingTestsBand", () => {
  it("titles the band after what it actually lists", () => {
    render(<LandingTestsBand tests={[test]} total={27} />);

    expect(screen.getByRole("heading", { name: "Pilih Tes Anda" })).toBeTruthy();
    // The list is the default createdAt ordering — no popularity to claim.
    expect(screen.queryByText(/Populer/i)).toBeNull();
  });

  it("states how many tests the catalog holds", () => {
    render(<LandingTestsBand tests={[test]} total={27} />);

    expect(screen.getByText("27 tes tersedia dalam 5 kategori.")).toBeTruthy();
  });

  it("renders the cards it was given", () => {
    render(<LandingTestsBand tests={[test]} total={27} />);

    expect(screen.getByText("Tes DISC")).toBeTruthy();
  });
});
