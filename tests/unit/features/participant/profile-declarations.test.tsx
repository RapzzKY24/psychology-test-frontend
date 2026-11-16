// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProfileDeclarations } from "@/features/participant/components/profile-declarations";
import type { MeProfileLastAttempt } from "@/lib/api/types";

afterEach(cleanup);

const attempt: MeProfileLastAttempt = {
  testName: "DISC Form A",
  startedAt: "2026-11-10T09:00:00.000Z",
  birthDate: "2000-01-31",
  gender: "FEMALE",
  education: "S1",
};

describe("ProfileDeclarations", () => {
  it("reads the declarations back in Indonesian", () => {
    render(<ProfileDeclarations attempt={attempt} />);

    expect(screen.getByText("31 Januari 2000")).toBeTruthy();
    expect(screen.getByText("Perempuan")).toBeTruthy();
    expect(screen.getByText("S1")).toBeTruthy();
    expect(screen.getByText("DISC Form A")).toBeTruthy();
  });

  it("keeps the day when the birth date is formatted in UTC", () => {
    render(<ProfileDeclarations attempt={{ ...attempt, birthDate: "2000-01-01" }} />);

    expect(screen.getByText("01 Januari 2000")).toBeTruthy();
  });

  it("shows a dash for a field the test never asked for", () => {
    render(
      <ProfileDeclarations
        attempt={{ ...attempt, gender: null, education: null, birthDate: null }}
      />,
    );

    expect(screen.getAllByText("—")).toHaveLength(3);
  });

  it("explains the empty state before the first test", () => {
    render(<ProfileDeclarations attempt={null} />);

    expect(screen.getByText(/terisi otomatis saat Anda memulai tes pertama/)).toBeTruthy();
  });
});
