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
const FAILED_SAVE_PREFIX = "pt:failed-save:attempt:";

function loadFailedItems(attemptId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`${FAILED_SAVE_PREFIX}${attemptId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function persistFailedItems(attemptId: string, items: Set<string>): void {
  try {
    const key = `${FAILED_SAVE_PREFIX}${attemptId}`;
    if (items.size > 0) localStorage.setItem(key, JSON.stringify([...items]));
    else localStorage.removeItem(key);
  } catch {
    // Storage may be disabled; the in-memory failure gate still applies.
  }
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
   * Mirror of `failedItems` for the render pass. The set itself stays in a ref
   * so the save queue can read it without a re-render, and the mirror is what
   * the caller sees.
   */
  const [failed, setFailed] = useState<{ ids: string[]; retryable: boolean }>({
    ids: [],
    retryable: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  /**
   * Answers are queued one request at a time. DISC writes most and least as two
   * separate clicks; firing them in parallel lets the second land first and the
   * upsert overwrite the first pick.
   */
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestValues = useRef(new Map<string, unknown>());
  const failedItems = useRef(new Set<string>());
  // Persist the IDs of writes still in flight too. A reload can interrupt a
  // request before it has a chance to reject, so failure-only tracking loses it.
  const unsyncedItems = useRef(new Set<string>());
  const persistOutstanding = useCallback(() => {
    persistFailedItems(
      attempt.id,
      new Set([...failedItems.current, ...unsyncedItems.current]),
    );
  }, [attempt.id]);
  /** Refresh the render mirror after the failure set changed. */
  const syncFailed = useCallback(() => {
    const ids = [...failedItems.current];
    setFailed({
      ids,
      // A failure loaded from storage has no value in memory, so it cannot be
      // resent until the participant types or picks that answer again.
      retryable: ids.length > 0 && ids.every((id) => latestValues.current.has(id)),
    });
  }, []);
  useEffect(() => {
    failedItems.current = loadFailedItems(attempt.id);
    syncFailed();
  }, [attempt.id, syncFailed]);
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
      latestValues.current.set(itemId, value);
      unsyncedItems.current.add(itemId);
      persistOutstanding();
      saveQueue.current = saveQueue.current
        .then(() => putResponse(attempt.id, itemId, value, participantToken ?? undefined))
        .then(() => {
          if (latestValues.current.get(itemId) === value) {
            failedItems.current.delete(itemId);
            unsyncedItems.current.delete(itemId);
            persistOutstanding();
            syncFailed();
          }
        })
        .catch((error: unknown) => {
          if (latestValues.current.get(itemId) === value) {
            failedItems.current.add(itemId);
            unsyncedItems.current.delete(itemId);
            persistOutstanding();
            syncFailed();
          }
          toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
        });
    },
    [attempt.id, participantToken, persistOutstanding, syncFailed],
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
      unsyncedItems.current.add(itemId);
      persistOutstanding();
      const queued = pending.current.get(itemId);
      if (queued) window.clearTimeout(queued.timer);
      const timer = window.setTimeout(() => {
        pending.current.delete(itemId);
        enqueue(itemId, value);
      }, delayMs);
      pending.current.set(itemId, { value, timer });
    },
    [enqueue, persistOutstanding],
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
      persistFailedItems(attempt.id, new Set());
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
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    flushPendingText();
    try {
      await saveQueue.current;
      if (failedItems.current.size > 0) return;
      await complete.mutateAsync();
    } catch {
      // The mutation's onError displays the API error.
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [complete, flushPendingText]);

  /**
   * `allowUnanswered` lets a family whose blanks are legal (the timed grid)
   * finish without walking the participant back to an item they deliberately
   * skipped. The clock would submit the same attempt a moment later.
   */
  const tryComplete = useCallback(
    (allowUnanswered = false): string | null => {
      const missing = allowUnanswered ? null : firstUnansweredId;
      if (missing) return missing;
      void submit();
      return null;
    },
    [firstUnansweredId, submit],
  );

  const retryFailed = useCallback(async () => {
    if (submittingRef.current) return;
    for (const itemId of [...failedItems.current]) {
      if (latestValues.current.has(itemId)) {
        enqueue(itemId, latestValues.current.get(itemId));
      }
    }
    await saveQueue.current;
  }, [enqueue]);

  return {
    answers,
    answer,
    answerText,
    answerDebounced,
    flushPendingText,
    answeredCount,
    firstUnansweredId,
    completed,
    completing: submitting || complete.isPending,
    savingFailed: failed.ids.length > 0,
    failedItemIds: failed.ids,
    canRetryFailed: failed.retryable,
    retryFailed,
    submit,
    tryComplete,
  };
}
