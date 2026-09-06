"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AttemptRead } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";
import { completeAttempt, putResponse } from "../api";

type AnswerMap = Record<string, DiscResponse>;

const isAnswered = (value: DiscResponse | undefined): boolean =>
  value !== undefined && value.most >= 0 && value.least >= 0;

/**
 * Answer state for the DISC runner: one upsert PUT per answered item
 * (server-side upsert on (attemptId, itemId)), then an idempotent complete.
 */
export function useDiscAnswers(
  attempt: AttemptRead,
  participantToken: string | null,
  onCompleted: (attemptId: string) => void,
) {
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    Object.fromEntries(
      attempt.responses.map((response) => [response.itemId, response.value as DiscResponse]),
    ),
  );
  const [completed, setCompleted] = useState(false);

  const setAnswer = useCallback((itemId: string, value: DiscResponse) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const save = useMutation({
    mutationFn: async (input: { itemId: string; value: DiscResponse }) => {
      await putResponse(attempt.id, input.itemId, input.value, participantToken ?? undefined);
    },
    meta: { silentError: true },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });

  /** Sets both parts; when the pair is complete and valid, upserts to the server. */
  const answer = useCallback(
    (itemId: string, part: "most" | "least", wordIndex: number): string | null => {
      const current: DiscResponse = answers[itemId] ?? { most: -1, least: -1 };
      const next: DiscResponse = { ...current, [part]: wordIndex };
      if (next.most >= 0 && next.least >= 0 && next.most === next.least) {
        return "Kata Most dan Least tidak boleh sama.";
      }
      setAnswer(itemId, next);
      if (next.most >= 0 && next.least >= 0) {
        save.mutate({ itemId, value: next });
      }
      return null;
    },
    [answers, participantToken, save, setAnswer],
  );

  const items = attempt.items;
  const answeredCount = useMemo(
    () => items.filter((item) => isAnswered(answers[item.id])).length,
    [items, answers],
  );
  const firstUnansweredId = useMemo(
    () => items.find((item) => !isAnswered(answers[item.id]))?.id ?? null,
    [items, answers],
  );

  const complete = useMutation({
    mutationFn: async () => {
      const { data } = await completeAttempt(attempt.id, participantToken ?? undefined);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (result) => {
      setCompleted(true);
      onCompleted(attempt.id);
      void result;
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });

  /** Client-side completeness check before the idempotent complete POST. */
  const tryComplete = useCallback((): string | null => {
    const missing = firstUnansweredId;
    if (missing) return missing;
    complete.mutate();
    return null;
  }, [complete, firstUnansweredId]);

  return {
    answers,
    answer,
    answeredCount,
    firstUnansweredId,
    completed,
    completing: complete.isPending,
    tryComplete,
  };
}
