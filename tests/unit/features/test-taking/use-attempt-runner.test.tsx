// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useAttemptRunner } from "@/features/test-taking/hooks/use-attempt-runner";
import { completeAttempt, putResponse } from "@/features/test-taking/api";
import type { AttemptRead } from "@/lib/api/types";

vi.mock("@/features/test-taking/api", () => ({
  putResponse: vi.fn().mockResolvedValue({ data: {} }),
  completeAttempt: vi.fn().mockResolvedValue({ data: {} }),
}));

function discAttempt(responses: AttemptRead["responses"] = [], itemCount = 3): AttemptRead {
  return {
    id: "attempt-1",
    sessionId: "session-1",
    testId: "test-1",
    testName: "DISC",
    scorerType: "FORCED_CHOICE_DISC",
    status: "IN_PROGRESS",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
    timeLimitMin: null,
    remainingSeconds: null,
    requiresGender: false,
    gender: null,
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
      {
        id: "item-1",
        order: 1,
        content: {
          answerMode: "choice",
          question: "2 + 2 = ?",
          options: ["3", "4"],
          multi: false,
        },
      },
      {
        id: "item-2",
        order: 2,
        content: {
          answerMode: "choice",
          question: "3 + 3 = ?",
          options: ["5", "6"],
          multi: false,
        },
      },
    ],
  };
}

function multiAttempt(): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    items: [
      {
        id: "item-1",
        order: 1,
        content: {
          answerMode: "choice",
          question: "Dua peribahasa",
          options: ["A", "B", "C"],
          multi: true,
        },
      },
      { ...attempt.items[1] },
    ],
  };
}

function shortAttempt(): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    items: [
      { id: "item-1", order: 1, content: { answerMode: "short", question: "Harga ½ lusin?" } },
      { ...attempt.items[1] },
    ],
  };
}

function pairAttempt(responses: AttemptRead["responses"] = []): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    scorerType: "FORCED_CHOICE_PAIR",
    responses,
    items: [
      {
        id: "item-1",
        order: 1,
        content: {
          question: "Mana yang lebih Anda pilih?",
          statements: ["Saya suka keramaian", "Saya suka menyendiri"],
        },
      },
      {
        id: "item-2",
        order: 2,
        content: {
          question: "Mana yang lebih Anda pilih?",
          statements: ["Saya percaya fakta", "Saya percaya intuisi"],
        },
      },
    ],
  };
}

function likertAttempt(responses: AttemptRead["responses"] = []): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    scorerType: "LIKERT",
    responses,
    items: [
      {
        id: "item-1",
        order: 1,
        content: { text: "Saya suka bergaul", scale: "E", min: 1, max: 5 },
      },
      {
        id: "item-2",
        order: 2,
        content: { text: "Saya mudah cemas", scale: "N", min: 1, max: 5 },
      },
    ],
  };
}

function rankAttempt(responses: AttemptRead["responses"] = []): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    scorerType: "RANK_GROUP",
    responses,
    items: [
      {
        id: "item-1",
        order: 1,
        content: { question: "Kelompok A", options: ["Petani", "Akuntan", "Dokter"] },
      },
      {
        id: "item-2",
        order: 2,
        content: { question: "Kelompok B", options: ["Nelayan", "Kasir", "Ahli bedah"] },
      },
    ],
  };
}

function markAttempt(responses: AttemptRead["responses"] = []): AttemptRead {
  const attempt = rightWrongAttempt();
  return {
    ...attempt,
    scorerType: "MARK_GROUP",
    responses,
    items: [
      {
        id: "item-1",
        order: 1,
        content: { question: "Kelompok 1", options: ["Berkebun", "Membongkar mesin", "Melukis"] },
      },
      {
        id: "item-2",
        order: 2,
        content: { question: "Kelompok 2", options: ["Menanam padi", "Menyanyi", "Mengetik"] },
      },
    ],
  };
}

function timedAttempt(remainingSeconds: number): AttemptRead {
  return {
    ...rightWrongAttempt(),
    timeLimitMin: 12,
    remainingSeconds,
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

  it("saves the chosen option and advances for a single-answer item", async () => {
    const { result } = renderRunner(rightWrongAttempt());

    await act(async () => result.current.chooseRightWrong([1]));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: [1] }, undefined),
    );
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
  });

  it("stays on a multi-answer item so the second tick is not lost", async () => {
    const { result } = renderRunner(multiAttempt());

    await act(async () => result.current.chooseRightWrong([0]));
    await act(async () => result.current.chooseRightWrong([0, 2]));

    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(result.current.safeIndex).toBe(0);
    expect(result.current.chosen).toEqual([0, 2]);
  });

  it("saves a typed answer once typing pauses", async () => {
    const { result } = renderRunner(shortAttempt());

    await act(async () => result.current.typeRightWrong("2"));
    await act(async () => result.current.typeRightWrong("20"));

    await waitFor(
      () =>
        expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { text: "20" }, undefined),
      { timeout: 2000 },
    );
    expect(putResponse).toHaveBeenCalledTimes(1);
  });

  it("saves the picked statement and advances for a pair item", async () => {
    const { result } = renderRunner(pairAttempt());

    await act(async () => result.current.choosePair(1));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: 1 }, undefined),
    );
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
  });

  it("prefills a stored pair pick and counts it as answered", () => {
    const { result } = renderRunner(pairAttempt([{ itemId: "item-1", value: { chosen: 0 } }]));

    expect(result.current.pairChoice).toBe(0);
    expect(result.current.answered).toEqual([true, false]);
  });

  it("treats a pair tally as a pair item", async () => {
    const { result } = renderRunner({ ...pairAttempt(), scorerType: "PAIR_TALLY" });

    expect(result.current.isPair).toBe(true);
    expect(result.current.usesChoiceView).toBe(false);

    await act(async () => result.current.choosePair(1));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: 1 }, undefined),
    );
    expect(result.current.answered[0]).toBe(true);
  });

  it("treats a style grid as a pair item", async () => {
    const { result } = renderRunner({ ...pairAttempt(), scorerType: "STYLE_GRID" });

    expect(result.current.isPair).toBe(true);
    expect(result.current.usesChoiceView).toBe(false);

    await act(async () => result.current.choosePair(0));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: 0 }, undefined),
    );
    expect(result.current.answered[0]).toBe(true);
  });

  it("treats a normed pair as a pair item", async () => {
    const { result } = renderRunner({ ...pairAttempt(), scorerType: "PAIR_NORM" });

    expect(result.current.isPair).toBe(true);
    expect(result.current.usesChoiceView).toBe(false);

    await act(async () => result.current.choosePair(1));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { chosen: 1 }, undefined),
    );
    expect(result.current.answered[0]).toBe(true);
  });

  it("counts a typed answer as answered", async () => {
    const { result } = renderRunner(shortAttempt());

    await act(async () => result.current.typeRightWrong("20"));

    expect(result.current.answered[0]).toBe(true);
  });

  it("treats a Likert item as a rating, not a choice or a pair", async () => {
    const { result } = renderRunner(likertAttempt());

    expect(result.current.usesRatingView).toBe(true);
    expect(result.current.usesChoiceView).toBe(false);
    expect(result.current.isPair).toBe(false);
    expect(result.current.discValue).toBeUndefined();

    await act(async () => result.current.rate(4));

    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith("attempt-1", "item-1", { rating: 4 }, undefined),
    );
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
    expect(result.current.answered[0]).toBe(true);
  });

  it("prefills a stored rating", () => {
    const { result } = renderRunner(likertAttempt([{ itemId: "item-1", value: { rating: 3 } }]));

    expect(result.current.rating).toBe(3);
    expect(result.current.answered).toEqual([true, false]);
  });

  it("treats a ranking group as answered only once every option has a rank", async () => {
    const { result } = renderRunner(rankAttempt());

    expect(result.current.usesRankView).toBe(true);
    expect(result.current.usesRatingView).toBe(false);
    expect(result.current.discValue).toBeUndefined();

    await act(async () => result.current.rank([1, 0, 0]));
    expect(result.current.answered[0]).toBe(false);

    await act(async () => result.current.rank([1, 2, 3]));
    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith(
        "attempt-1",
        "item-1",
        { ranks: [1, 2, 3] },
        undefined,
      ),
    );
    expect(result.current.answered[0]).toBe(true);
    // The last rank completes the group, so the runner moves on by itself.
    await waitFor(() => expect(result.current.safeIndex).toBe(1));
  });

  it("prefills a stored ranking", () => {
    const { result } = renderRunner(
      rankAttempt([{ itemId: "item-1", value: { ranks: [2, 1, 3] } }]),
    );

    expect(result.current.ranks).toEqual([2, 1, 3]);
    expect(result.current.answered).toEqual([true, false]);
  });

  it("counts a marked list as answered once one activity is marked", async () => {
    const { result } = renderRunner(markAttempt());

    expect(result.current.usesMarkView).toBe(true);
    expect(result.current.usesRankView).toBe(false);
    expect(result.current.discValue).toBeUndefined();
    expect(result.current.answered[0]).toBe(false);

    await act(async () => result.current.mark({ liked: [1], disliked: [] }));
    await waitFor(() =>
      expect(putResponse).toHaveBeenCalledWith(
        "attempt-1",
        "item-1",
        { liked: [1], disliked: [] },
        undefined,
      ),
    );
    expect(result.current.answered[0]).toBe(true);
    // A list holds many judgements, so the runner never advances on its own.
    await act(async () => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(result.current.safeIndex).toBe(0);
  });

  it("prefills the marks already stored for a list", () => {
    const { result } = renderRunner(
      markAttempt([{ itemId: "item-1", value: { liked: [0], disliked: [2] } }]),
    );

    expect(result.current.marks).toEqual({ liked: [0], disliked: [2] });
    expect(result.current.answered).toEqual([true, false]);
  });

  it("submits on its own when the deadline passes", async () => {
    const { result } = renderRunner(timedAttempt(-5));

    await waitFor(() => expect(completeAttempt).toHaveBeenCalledWith("attempt-1", undefined));
    expect(result.current.timeUp).toBe(true);
  });

  it("keeps the countdown running before the deadline", async () => {
    const { result } = renderRunner(timedAttempt(60));

    expect(result.current.timeUp).toBe(false);
    expect(result.current.remainingSeconds).toBeGreaterThan(55);
    expect(completeAttempt).not.toHaveBeenCalled();
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
