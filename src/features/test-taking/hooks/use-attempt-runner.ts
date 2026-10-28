"use client";

import { useCallback, useState } from "react";
import { useAttemptAnswers } from "./use-attempt-answers";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";

/** Delay before jumping to the next question once an answer is complete. */
const AUTO_ADVANCE_MS = {
  FORCED_CHOICE_DISC: 400,
  RIGHT_WRONG_NORM: 300,
} as const;

function isAnsweredDisc(value: unknown): value is DiscResponse {
  const v = value as DiscResponse | undefined;
  return v !== undefined && v.most >= 0 && v.least >= 0;
}

/**
 * Half-filled picks must survive navigation, so a partial answer is read back
 * as-is instead of being reset to an empty draft.
 */
function toDiscDraft(value: unknown): DiscResponse {
  const v = value as Partial<DiscResponse> | undefined;
  return {
    most: typeof v?.most === "number" ? v.most : -1,
    least: typeof v?.least === "number" ? v.least : -1,
  };
}

interface UseAttemptRunnerInput {
  attempt: AttemptRead;
  participantToken: string | null;
  scorerType: ScorerType;
}

/**
 * All runner behaviour in one place: which item is on screen, what counts as
 * answered for each scorer family, the DISC most !== least rule, and the
 * auto-advance timer. Components below it only render.
 */
export function useAttemptRunner({
  attempt,
  participantToken,
  scorerType,
}: UseAttemptRunnerInput) {
  const answers = useAttemptAnswers(attempt, participantToken, scorerType, () => {});
  const [index, setIndex] = useState(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const isRightWrong = scorerType === "RIGHT_WRONG_NORM";
  const total = attempt.items.length;
  const safeIndex = Math.min(index, Math.max(total - 1, 0));
  const item = attempt.items[safeIndex];
  const rawValue = item ? answers.answers[item.id] : undefined;
  const currentAnswered = isRightWrong
    ? (rawValue as { chosen?: unknown } | undefined)?.chosen !== undefined
    : isAnsweredDisc(rawValue);
  const isLast = safeIndex === total - 1;
  const allAnswered = answers.answeredCount === total;
  const content = (item?.content ?? {}) as Record<string, unknown>;

  const answered = attempt.items.map((it) =>
    isRightWrong
      ? (answers.answers[it.id] as { chosen?: unknown } | undefined)?.chosen !== undefined
      : isAnsweredDisc(answers.answers[it.id]),
  );

  const advance = useCallback(() => {
    window.setTimeout(
      () => setIndex((current) => Math.min(current + 1, Math.max(total - 1, 0))),
      AUTO_ADVANCE_MS[scorerType],
    );
  }, [scorerType, total]);

  const selectDisc = useCallback(
    (part: "most" | "least", wordIndex: number) => {
      if (!item) return;
      const next = { ...toDiscDraft(rawValue), [part]: wordIndex };

      if (next.most >= 0 && next.least >= 0 && next.most === next.least) {
        setDuplicateWarning("Kata Most dan Least tidak boleh sama.");
        return;
      }

      setDuplicateWarning(null);
      answers.answer(item.id, next);
      if (next.most >= 0 && next.least >= 0 && !isLast) advance();
    },
    [advance, answers, isLast, item, rawValue],
  );

  const selectRightWrong = useCallback(
    (chosen: number) => {
      if (!item) return;
      answers.answer(item.id, { chosen });
      if (!isLast) advance();
    },
    [advance, answers, isLast, item],
  );

  const goNext = useCallback(() => {
    setDuplicateWarning(null);
    setIndex((current) => Math.min(current + 1, Math.max(total - 1, 0)));
  }, [total]);

  const goPrev = useCallback(() => {
    setDuplicateWarning(null);
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const finish = useCallback(() => {
    const missing = answers.tryComplete();
    if (!missing) return;
    const missingIndex = attempt.items.findIndex((it) => it.id === missing);
    if (missingIndex !== -1) setIndex(missingIndex);
  }, [answers, attempt.items]);

  // Partial DISC picks must still render on return, so the raw value goes
  // through as-is; the view already treats a missing half as "not picked".
  const discValue = isRightWrong ? undefined : (rawValue as DiscResponse | undefined);
  const chosen = (rawValue as { chosen?: number } | undefined)?.chosen;

  return {
    isRightWrong,
    total,
    safeIndex,
    item,
    discValue,
    chosen,
    content,
    currentAnswered,
    isLast,
    allAnswered,
    answered,
    duplicateWarning,
    completed: answers.completed,
    completing: answers.completing,
    answeredCount: answers.answeredCount,
    selectDisc,
    selectRightWrong,
    goNext,
    goPrev,
    finish,
    goTo: setIndex,
  };
}
