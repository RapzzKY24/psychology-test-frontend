"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAttemptAnswers } from "./use-attempt-answers";
import { useRemainingSeconds } from "./use-remaining-seconds";
import { isAnsweredValue, toChosen, toPairChoice, toText } from "../lib/answer-state";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";

/** Delay before jumping to the next question once an answer is complete. */
const AUTO_ADVANCE_MS = {
  CHOICE_TALLY: 300,
  FORCED_CHOICE_DISC: 400,
  FORCED_CHOICE_PAIR: 350,
  PAIR_TALLY: 350,
  RIGHT_WRONG_NORM: 300,
  SCALE_TALLY: 300,
} as const;

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
 * answered for each scorer family, the DISC most !== least rule, the
 * auto-advance timer, and the server-owned countdown.
 */
export function useAttemptRunner({ attempt, participantToken, scorerType }: UseAttemptRunnerInput) {
  const answers = useAttemptAnswers(attempt, participantToken, scorerType, () => {});
  const [index, setIndex] = useState(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const advanceTimer = useRef<number | null>(null);

  // Three families draw the same "question + options" screen: right/wrong
  // items, tally statements and choice tallies. Only the scoring differs.
  const usesChoiceView =
    scorerType === "RIGHT_WRONG_NORM" ||
    scorerType === "SCALE_TALLY" ||
    scorerType === "CHOICE_TALLY";
  const isPair = scorerType === "FORCED_CHOICE_PAIR" || scorerType === "PAIR_TALLY";
  const isAnswered = (value: unknown) => isAnsweredValue(scorerType, value);
  const total = attempt.items.length;
  const safeIndex = Math.min(index, Math.max(total - 1, 0));
  const item = attempt.items[safeIndex];
  const rawValue = item ? answers.answers[item.id] : undefined;
  const currentAnswered = isAnswered(rawValue);
  const isLast = safeIndex === total - 1;
  const allAnswered = answers.answeredCount === total;
  const content = (item?.content ?? {}) as Record<string, unknown>;

  const answered = attempt.items.map((it) => isAnswered(answers.answers[it.id]));

  const remainingSeconds = useRemainingSeconds(attempt.remainingSeconds);
  const timeUp = remainingSeconds !== null && remainingSeconds <= 0;
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!timeUp || submittedRef.current) return;
    submittedRef.current = true;
    void answers.submit();
  }, [timeUp, answers]);

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  // A pending auto-advance must never fire after a manual move: answering twice
  // in quick succession would otherwise skip two items.
  const advance = useCallback(() => {
    cancelAdvance();
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      setIndex((current) => Math.min(current + 1, Math.max(total - 1, 0)));
    }, AUTO_ADVANCE_MS[scorerType]);
  }, [cancelAdvance, scorerType, total]);

  useEffect(() => cancelAdvance, [cancelAdvance]);

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

  /**
   * A multi-key item keeps the participant on the question until they move on
   * themselves — advancing after every tick would cut the second pick off.
   */
  const chooseRightWrong = useCallback(
    (chosen: number[]) => {
      if (!item) return;
      answers.answer(item.id, { chosen });
      if (content.multi !== true && !isLast) advance();
    },
    [advance, answers, content.multi, isLast, item],
  );

  /** A pair item holds one pick, so a single click is a complete answer. */
  const choosePair = useCallback(
    (chosen: number) => {
      if (!item) return;
      answers.answer(item.id, { chosen });
      if (!isLast) advance();
    },
    [advance, answers, isLast, item],
  );

  const typeRightWrong = useCallback(
    (text: string) => {
      if (!item) return;
      answers.answerText(item.id, text);
    },
    [answers, item],
  );

  const goNext = useCallback(() => {
    cancelAdvance();
    setDuplicateWarning(null);
    setIndex((current) => Math.min(current + 1, Math.max(total - 1, 0)));
  }, [cancelAdvance, total]);

  const goPrev = useCallback(() => {
    cancelAdvance();
    setDuplicateWarning(null);
    setIndex((current) => Math.max(current - 1, 0));
  }, [cancelAdvance]);

  const goTo = useCallback(
    (next: number) => {
      cancelAdvance();
      setIndex(next);
    },
    [cancelAdvance],
  );

  const finish = useCallback(() => {
    const missing = answers.tryComplete();
    if (!missing) return;
    const missingIndex = attempt.items.findIndex((it) => it.id === missing);
    if (missingIndex !== -1) setIndex(missingIndex);
  }, [answers, attempt.items]);

  // Partial DISC picks must still render on return, so the raw value goes
  // through as-is; the view already treats a missing half as "not picked".
  const discValue = usesChoiceView || isPair ? undefined : (rawValue as DiscResponse | undefined);

  return {
    usesChoiceView,
    isPair,
    total,
    safeIndex,
    item,
    discValue,
    pairChoice: toPairChoice(rawValue),
    chosen: toChosen(rawValue),
    text: toText(rawValue),
    mode: content.answerMode === "short" ? ("short" as const) : ("choice" as const),
    multi: content.multi === true,
    content,
    currentAnswered,
    isLast,
    allAnswered,
    answered,
    duplicateWarning,
    completed: answers.completed,
    completing: answers.completing,
    answeredCount: answers.answeredCount,
    remainingSeconds,
    timeUp,
    selectDisc,
    chooseRightWrong,
    choosePair,
    typeRightWrong,
    goNext,
    goPrev,
    finish,
    goTo,
  };
}
