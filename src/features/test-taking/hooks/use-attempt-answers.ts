"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import { isAnsweredValue } from "../lib/answer-state";
import { completeAttempt, putResponse } from "../api";

export type AnswerValue = Record<string, unknown>;

/** Typing a short answer would fire one PUT per keystroke without this. */
const TEXT_SAVE_DEBOUNCE_MS = 500;

/**
 * Generic answer state for the runner: one upsert PUT per answered item
 * (server-side upsert on (attemptId, itemId)), then an idempotent complete.
 * Parameterized by scorerType so families share save/complete/progress logic —
 * family specifics (e.g. DISC most !== least) live in the ItemView runner.
 */
export function useAttemptAnswers(
  attempt: AttemptRead,
  participantToken: string | null,
  scorerType: ScorerType,
  onCompleted: (attemptId: string) => void,
) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(attempt.responses.map((r) => [r.itemId, r.value])),
  );
  const [completed, setCompleted] = useState(false);

  /**
   * Answers are queued one request at a time. DISC writes most and least as two
   * separate clicks; firing them in parallel lets the second land first and the
   * upsert overwrite the first pick.
   */
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  /**
   * Items whose latest value has not been sent yet. A map, not a single slot:
   * a digit grid debounces one lajur while the participant may already have
   * moved on to the next, and a single slot would drop the earlier lajur.
   */
  const pending = useRef(
    new Map<string, { value: unknown; timer: number }>(),
  );

  const enqueue = useCallback(
    (itemId: string, value: unknown) => {
      saveQueue.current = saveQueue.current
        .then(() => putResponse(attempt.id, itemId, value, participantToken ?? undefined))
        .then(() => undefined)
        .catch((error: unknown) => {
          toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
        });
    },
    [attempt.id, participantToken],
  );

  const answer = useCallback(
    (itemId: string, value: unknown) => {
      setAnswers((prev) => ({ ...prev, [itemId]: value }));
      enqueue(itemId, value);
    },
    [enqueue],
  );

  /**
   * The UI takes the value at once; the server only hears about it when the
   * participant pauses. Used for short answers and for a digit grid, where a
   * lajur of 27 gaps would otherwise be 27 PUTs.
   */
  const answerDebounced = useCallback(
    (itemId: string, value: unknown, delayMs = TEXT_SAVE_DEBOUNCE_MS) => {
      setAnswers((prev) => ({ ...prev, [itemId]: value }));
      const queued = pending.current.get(itemId);
      if (queued) window.clearTimeout(queued.timer);
      const timer = window.setTimeout(() => {
        pending.current.delete(itemId);
        enqueue(itemId, value);
      }, delayMs);
      pending.current.set(itemId, { value, timer });
    },
    [enqueue],
  );

  /** Short answers update the UI at once but only reach the server when idle. */
  const answerText = useCallback(
    (itemId: string, text: string) => {
      answerDebounced(itemId, { text });
    },
    [answerDebounced],
  );

  const flushPendingText = useCallback(() => {
    for (const [itemId, queued] of pending.current) {
      window.clearTimeout(queued.timer);
      enqueue(itemId, queued.value);
    }
    pending.current.clear();
  }, [enqueue]);

  // A lajur left half-typed when the tab closes would lose its last digits.
  useEffect(() => {
    const flush = () => flushPendingText();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [flushPendingText]);

  const items = attempt.items;
  const answeredCount = useMemo(
    () => items.filter((item) => isAnsweredValue(scorerType, answers[item.id])).length,
    [items, answers, scorerType],
  );
  const firstUnansweredId = useMemo(
    () => items.find((item) => !isAnsweredValue(scorerType, answers[item.id]))?.id ?? null,
    [items, answers, scorerType],
  );

  const complete = useMutation({
    mutationFn: async () => {
      const { data } = await completeAttempt(attempt.id, participantToken ?? undefined);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      setCompleted(true);
      onCompleted(attempt.id);
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });

  /**
   * Sends the attempt no matter what is still blank. The server scores blanks as
   * wrong for a raw-score test, and the countdown calls this at zero.
   */
  const submit = useCallback(async () => {
    flushPendingText();
    await saveQueue.current;
    complete.mutate();
  }, [complete, flushPendingText]);

  const tryComplete = useCallback((): string | null => {
    flushPendingText();
    const missing = firstUnansweredId;
    if (missing) return missing;
    complete.mutate();
    return null;
  }, [complete, firstUnansweredId, flushPendingText]);

  return {
    answers,
    answer,
    answerText,
    answerDebounced,
    flushPendingText,
    answeredCount,
    firstUnansweredId,
    completed,
    completing: complete.isPending,
    submit,
    tryComplete,
  };
}
