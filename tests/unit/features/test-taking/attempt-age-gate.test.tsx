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

describe("AttemptRunnerIsland age gate", () => {
  it("asks for a birth date when the API requires one", async () => {
    vi.mocked(fetchAttempt).mockRejectedValue(new ApiError(422, "birth_date_required"));
    renderIsland();

    expect(await screen.findByText("Konfirmasi usia peserta")).toBeTruthy();
    const submit = screen.getByRole("button", { name: "Lanjutkan" });
    expect(submit.hasAttribute("disabled")).toBe(true);
  });

  it("retries the attempt read with the declared date", async () => {
    vi.mocked(fetchAttempt).mockRejectedValue(new ApiError(422, "birth_date_required"));
    renderIsland();

    fireEvent.change(await screen.findByLabelText(/Tanggal lahir peserta/), {
      target: { value: "2012-08-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lanjutkan" }));

    await waitFor(() => {
      expect(fetchAttempt).toHaveBeenCalledWith("attempt-1", "tok", "2012-08-01", null);
    });
  });

  it("keeps the typed date visible when the API calls it invalid", async () => {
    vi.mocked(fetchAttempt)
      .mockRejectedValueOnce(new ApiError(422, "birth_date_required"))
      .mockRejectedValueOnce(new ApiError(422, "birth_date_invalid"));
    renderIsland();

    fireEvent.change(await screen.findByLabelText(/Tanggal lahir peserta/), {
      target: { value: "2012-08-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lanjutkan" }));

    expect(await screen.findByText(/Tanggal lahir tidak valid/)).toBeTruthy();
    expect((screen.getByLabelText(/Tanggal lahir peserta/) as HTMLInputElement).value).toBe(
      "2012-08-01",
    );
  });

  it("blocks a participant outside the band", async () => {
    vi.mocked(fetchAttempt).mockRejectedValue(new ApiError(422, "age_out_of_band"));
    renderIsland();

    expect(await screen.findByText("Usia peserta di luar rentang norma")).toBeTruthy();
    expect(screen.queryByLabelText(/Tanggal lahir peserta/)).toBeNull();
  });
});
