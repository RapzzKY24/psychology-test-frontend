"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";
import { completeAttempt, putResponse } from "../api";

export type AnswerValue = Record<string, unknown>;

/** Typing a short answer would fire one PUT per keystroke without this. */
const TEXT_SAVE_DEBOUNCE_MS = 500;

function isAnsweredValue(scorerType: ScorerType, value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (scorerType === "FORCED_CHOICE_DISC") {
    const v = value as DiscResponse;
    return v.most >= 0 && v.least >= 0;
  }
  const v = value as { chosen?: number | number[]; text?: string };
  if (Array.isArray(v.chosen)) return v.chosen.length > 0;
  if (typeof v.chosen === "number") return true;
  return Boolean(v.text && v.text.trim().length > 0);
}

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
  const pendingText = useRef<{ itemId: string; value: unknown; timer: number } | null>(null);

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

  /** Short answers update the UI at once but only reach the server when idle. */
  const answerText = useCallback(
    (itemId: string, text: string) => {
      setAnswers((prev) => ({ ...prev, [itemId]: { text } }));
      if (pendingText.current) window.clearTimeout(pendingText.current.timer);
      const timer = window.setTimeout(() => {
        pendingText.current = null;
        enqueue(itemId, { text });
      }, TEXT_SAVE_DEBOUNCE_MS);
      pendingText.current = { itemId, value: { text }, timer };
    },
    [enqueue],
  );

  const flushPendingText = useCallback(() => {
    const pending = pendingText.current;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    pendingText.current = null;
    enqueue(pending.itemId, pending.value);
  }, [enqueue]);

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
    answeredCount,
    firstUnansweredId,
    completed,
    completing: complete.isPending,
    submit,
    tryComplete,
  };
}
