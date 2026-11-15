// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TestPsychologistCard } from "@/features/public/components/test-psychologist-card";
import type { PublicPsychologist } from "@/lib/api/types";

afterEach(cleanup);

const psychologist: PublicPsychologist = {
  fullName: "Ayu Lestari",
  degree: "Psikolog",
  licenseNumber: "STR-123",
  sippNumber: "SIPP-9",
  institutionName: "RS Harapan",
};

describe("TestPsychologistCard", () => {
  it("prints the credentials the report shows under the signature", () => {
    render(<TestPsychologistCard psychologists={[psychologist]} />);

    expect(screen.getByRole("heading", { name: "Psikolog Berlisensi" })).toBeTruthy();
    expect(screen.getByText("Ayu Lestari")).toBeTruthy();
    expect(screen.getByText("Psikolog · STR/SIK STR-123 · SIPP SIPP-9")).toBeTruthy();
    expect(screen.getByText("RS Harapan")).toBeTruthy();
  });

  it("drops the SIPP segment when the profile has none", () => {
    render(
      <TestPsychologistCard psychologists={[{ ...psychologist, sippNumber: null }]} />,
    );

    expect(screen.getByText("Psikolog · STR/SIK STR-123")).toBeTruthy();
  });

  it("renders nothing when nobody signs yet", () => {
    const { container } = render(<TestPsychologistCard psychologists={[]} />);

    expect(container.innerHTML).toBe("");
  });
});
