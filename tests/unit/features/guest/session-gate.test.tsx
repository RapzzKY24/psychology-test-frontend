// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SessionGate } from "@/features/guest/components/session-gate";
import { setGuestResume } from "@/lib/guest-token";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  push.mockClear();
});

describe("SessionGate", () => {
  it("renders the join flow when no resume is stored", () => {
    render(
      <SessionGate token="sess-tok">
        <p>pilih nama</p>
      </SessionGate>,
    );

    expect(screen.getByText("pilih nama")).toBeTruthy();
    expect(screen.queryByText(/Lanjutkan sebagai/)).toBeNull();
  });

  it("offers a one-tap resume when a stored record exists", () => {
    setGuestResume("sess-tok", {
      participantName: "Budi Santoso",
      attemptIds: ["a1"],
    });

    render(
      <SessionGate token="sess-tok">
        <p>pilih nama</p>
      </SessionGate>,
    );

    expect(screen.getByText(/Lanjutkan sebagai Budi Santoso/)).toBeTruthy();
    expect(screen.queryByText("pilih nama")).toBeNull();
  });

  it("falls back to the join flow when the resume is dismissed", async () => {
    setGuestResume("sess-tok", { participantName: "Budi", attemptIds: ["a1"] });

    render(
      <SessionGate token="sess-tok">
        <p>pilih nama</p>
      </SessionGate>,
    );

    fireEvent.click(screen.getByText(/Bukan saya/));

    await waitFor(() => expect(screen.getByText("pilih nama")).toBeTruthy());
  });
});
