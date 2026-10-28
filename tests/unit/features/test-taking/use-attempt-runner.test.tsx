// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useAttemptRunner } from "@/features/test-taking/hooks/use-attempt-runner";
import { putResponse } from "@/features/test-taking/api";
import type { AttemptRead } from "@/lib/api/types";

vi.mock("@/features/test-taking/api", () => ({
  putResponse: vi.fn().mockResolvedValue({ data: {} }),
  completeAttempt: vi.fn().mockResolvedValue({ data: {} }),
}));

function discAttempt(
  responses: AttemptRead["responses"] = [],
  itemCount = 3,
): AttemptRead {
  return {
    id: "attempt-1",
    sessionId: "session-1",
    testId: "test-1",
    testName: "DISC",
    scorerType: "FORCED_CHOICE_DISC",
    status: "IN_PROGRESS",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
    items: Array.from({ length: itemCount }, (_, i) => ({
      id: `item-${i + 1}`,
      order: i + 1,
      content: { words: ["Tenang", "Tegas", "Ramah", "Teliti"] },
    })),
    responses,
  };
}

function rightWrongAttempt(): AttemptRead {
  return {
    ...discAttempt([], 2),
    scorerType: "RIGHT_WRONG_NORM",
    items: [
      { id: "item-1", order: 1, content: { question: "2 + 2 = ?", options: ["3", "4"] } },
      { id: "item-2", order: 2, content: { question: "3 + 3 = ?", options: ["5", "6"] } },
    ],
  };
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function renderRunner(attempt: AttemptRead) {
  return renderHook(
    () =>
      useAttemptRunner({
        attempt,
        participantToken: null,
        scorerType: attempt.scorerType,
      }),
    { wrapper },
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useAttemptRunner", () => {
  it("prefills answers that the server already stored", () => {
    const { result } = renderRunner(
      discAttempt([{ itemId: "item-1", value: { most: 0, least: 2 } }]),
    );

    expect(result.current.discValue).toEqual({ most: 0, least: 2 });
    expect(result.current.answered).toEqual([true, false, false]);
    expect(result.current.answeredCount).toBe(1);
  });

  it("rejects the same word for Most and Least without saving", async () => {
    const { result } = renderRunner(discAttempt());

    await act(async () => result.current.selectDisc("most", 1));
    await act(async () => result.current.selectDisc("least", 1));

    expect(result.current.duplicateWarning).toBe("Kata Most dan Least tidak boleh sama.");
    expect(result.current.discValue).toEqual({ most: 1, least: -1 });
    expect(putResponse).toHaveBeenCalledTimes(1);
  });

  it("advances to the next question once both halves are picked", async () => {
    const { result } = renderRunner(discAttempt());

    await act(async () => result.current.selectDisc("most", 0));
    await act(async () => result.current.selectDisc("least", 3));

    expect(result.current.safeIndex).toBe(0);
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
  });

  it("does not auto-advance past the last question", async () => {
    const { result } = renderRunner(discAttempt([], 1));

    await act(async () => result.current.selectDisc("most", 0));
    await act(async () => result.current.selectDisc("least", 3));

    expect(result.current.isLast).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(result.current.safeIndex).toBe(0);
  });

  it("saves the chosen option and advances for right/wrong items", async () => {
    const { result } = renderRunner(rightWrongAttempt());

    await act(async () => result.current.selectRightWrong(1));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: 1 }, undefined),
    );
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
  });

  it("steps back and forward without leaving the range", async () => {
    const { result } = renderRunner(discAttempt());

    await act(async () => result.current.goPrev());
    expect(result.current.safeIndex).toBe(0);

    await act(async () => result.current.goNext());
    await act(async () => result.current.goNext());
    await act(async () => result.current.goNext());
    expect(result.current.safeIndex).toBe(2);
  });
});
