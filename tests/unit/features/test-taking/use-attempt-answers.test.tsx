// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAttemptAnswers } from "@/features/test-taking/hooks/use-attempt-answers";
import type { AttemptRead } from "@/lib/api/types";

vi.mock("@/features/test-taking/api", () => ({
  putResponse: vi.fn(),
  completeAttempt: vi.fn(),
}));

const { putResponse, completeAttempt } = await import("@/features/test-taking/api");
const putResponseMock = vi.mocked(putResponse);
const completeAttemptMock = vi.mocked(completeAttempt);

const attempt = {
  id: "attempt-1",
  items: [{ id: "i1", order: 1, content: { words: ["a", "b", "c", "d"] } }],
  responses: [],
} as unknown as AttemptRead;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

function makeWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAttemptAnswers", () => {
  it("sends the second answer only after the first request settles", async () => {
    let release!: () => void;
    putResponseMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = () => resolve({ data: {} } as never);
        }),
    );
    putResponseMock.mockResolvedValue({ data: {} } as never);

    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useAttemptAnswers(attempt, null, "FORCED_CHOICE_DISC", () => {}),
      { wrapper },
    );

    await act(async () => {
      result.current.answer("i1", { most: 0 });
      result.current.answer("i1", { most: 0, least: 1 });
    });

    // The second PUT must wait: firing both at once lets the upsert land out of order.
    expect(putResponseMock).toHaveBeenCalledTimes(1);

    release();
    await waitFor(() => expect(putResponseMock).toHaveBeenCalledTimes(2));
    expect(putResponseMock).toHaveBeenLastCalledWith(
      "attempt-1",
      "i1",
      { most: 0, least: 1 },
      undefined,
    );
  });

  it("waits for the final answer before completing", async () => {
    let release!: () => void;
    putResponseMock.mockImplementationOnce(() => new Promise((resolve) => {
      release = () => resolve({ data: {} } as never);
    }));
    completeAttemptMock.mockResolvedValue({ data: {} } as never);
    const filled = { ...attempt, responses: [{ itemId: "i1", value: { most: 0, least: 1 } }] } as AttemptRead;
    const { result } = renderHook(
      () => useAttemptAnswers(filled, null, "FORCED_CHOICE_DISC", () => {}),
      { wrapper: makeWrapper() },
    );

    act(() => {
      result.current.answer("i1", { most: 1, least: 0 });
      expect(result.current.tryComplete()).toBeNull();
    });
    expect(completeAttemptMock).not.toHaveBeenCalled();
    await waitFor(() => expect(putResponseMock).toHaveBeenCalledTimes(1));
    release();
    await waitFor(() => expect(completeAttemptMock).toHaveBeenCalledTimes(1));
  });

  it("holds completion when a save fails, then allows a retry", async () => {
    putResponseMock.mockRejectedValueOnce(new Error("offline"));
    putResponseMock.mockResolvedValue({ data: {} } as never);
    completeAttemptMock.mockResolvedValue({ data: {} } as never);
    const { result } = renderHook(
      () => useAttemptAnswers(attempt, null, "RIGHT_WRONG_NORM", () => {}),
      { wrapper: makeWrapper() },
    );

    await act(async () => {
      result.current.answer("i1", { chosen: [0] });
      await result.current.submit();
    });
    expect(result.current.savingFailed).toBe(true);
    expect(completeAttemptMock).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.retryFailed();
      await result.current.submit();
    });
    expect(result.current.savingFailed).toBe(false);
    expect(completeAttemptMock).toHaveBeenCalledTimes(1);
  });

  it("keeps a failed-save gate after a page reload", async () => {
    localStorage.setItem("pt:failed-save:attempt:attempt-1", JSON.stringify(["i1"]));
    const { result } = renderHook(
      () => useAttemptAnswers(attempt, null, "RIGHT_WRONG_NORM", () => {}),
      { wrapper: makeWrapper() },
    );
    await act(async () => { await result.current.submit(); });
    expect(result.current.savingFailed).toBe(true);
    expect(completeAttemptMock).not.toHaveBeenCalled();
  });
});
