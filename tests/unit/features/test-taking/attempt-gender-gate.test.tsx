// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AttemptRunnerIsland } from "@/features/test-taking/components/attempt-runner-island";
import { fetchAttempt } from "@/features/test-taking/api";
import { setGuestTokenForAttempt } from "@/lib/guest-token";
import { ApiError } from "@/lib/api/error";

vi.mock("@/features/test-taking/api", () => ({
  fetchAttempt: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function renderIsland() {
  return render(<AttemptRunnerIsland attemptId="attempt-1" />, { wrapper });
}

beforeEach(() => {
  localStorage.clear();
  setGuestTokenForAttempt("attempt-1", "tok");
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AttemptRunnerIsland gender gate", () => {
  it("asks for a sex when the API requires one", async () => {
    vi.mocked(fetchAttempt).mockRejectedValue(new ApiError(422, "gender_required"));
    renderIsland();

    expect(await screen.findByText("Konfirmasi jenis kelamin peserta")).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Laki-laki/ })).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Perempuan/ })).toBeTruthy();
    const submit = screen.getByRole("button", { name: "Lanjutkan" });
    expect(submit.hasAttribute("disabled")).toBe(true);
  });

  it("retries the attempt read with the picked sex", async () => {
    vi.mocked(fetchAttempt).mockRejectedValue(new ApiError(422, "gender_required"));
    renderIsland();

    fireEvent.click(await screen.findByRole("radio", { name: /Perempuan/ }));
    fireEvent.click(screen.getByRole("button", { name: "Lanjutkan" }));

    await waitFor(() => {
      expect(fetchAttempt).toHaveBeenCalledWith("attempt-1", "tok", null, "FEMALE", null);
    });
  });

  it("keeps the pick visible when the API calls it invalid", async () => {
    vi.mocked(fetchAttempt)
      .mockRejectedValueOnce(new ApiError(422, "gender_required"))
      .mockRejectedValueOnce(new ApiError(422, "gender_invalid"));
    renderIsland();

    fireEvent.click(await screen.findByRole("radio", { name: /Laki-laki/ }));
    fireEvent.click(screen.getByRole("button", { name: "Lanjutkan" }));

    expect(await screen.findByText(/Jenis kelamin tidak valid/)).toBeTruthy();
    expect(
      screen.getByRole("radio", { name: /Laki-laki/ }).getAttribute("aria-checked"),
    ).toBe("true");
  });
});
