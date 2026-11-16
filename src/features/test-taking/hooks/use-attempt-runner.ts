"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAttemptAnswers } from "./use-attempt-answers";
import { useRemainingSeconds } from "./use-remaining-seconds";
import {
  isAnsweredValue,
  toChosen,
  toManualImage,
  toMarks,
  toOptionChoice,
  toPairChoice,
  toRanks,
  toRating,
  toText,
  toTimedGridAnswers,
} from "../lib/answer-state";
import type { MarkState } from "../lib/answer-state";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";

/** Delay before jumping to the next question once an answer is complete. */
const AUTO_ADVANCE_MS = {
  CHOICE_TALLY: 300,
  FORCED_CHOICE_DISC: 400,
  FORCED_CHOICE_PAIR: 350,
  LIKERT: 250,
  // A drawing is saved with an explicit button, then the participant moves on
  // themselves — there is no "the last stroke completed the answer" moment.
  MANUAL: 0,
  MARK_GROUP: 300,
  // A battery runs its own screen; the entry only keeps the map complete.
  MULTI_SUBTEST: 0,
  OPTION_SCALE: 300,
  PAIR_NORM: 350,
  PAIR_TALLY: 350,
  RANK_GROUP: 400,
  RIGHT_WRONG_NORM: 300,
  SCALE_TALLY: 300,
  STYLE_GRID: 350,
  // The lajur view moves on itself once the last gap is filled; a delay here
  // would advance a second time while the next lajur is still rendering.
  TIMED_GRID: 0,
} as const;

/**
 * Long enough that a lajur's 27 keystrokes collapse into one PUT, short enough
 * that a lajur abandoned mid-typing still reaches the server before the clock
 * runs out.
 */
const TIMED_GRID_SAVE_MS = 1200;

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
  const isPair =
    scorerType === "FORCED_CHOICE_PAIR" ||
    scorerType === "PAIR_NORM" ||
    scorerType === "PAIR_TALLY" ||
    scorerType === "STYLE_GRID";
  const usesRatingView = scorerType === "LIKERT";
  const usesRankView = scorerType === "RANK_GROUP";
  const usesMarkView = scorerType === "MARK_GROUP";
  // A three-option statement draws text buttons (a/b/c), not a rating row.
  const usesOptionView = scorerType === "OPTION_SCALE";
  // A timed grid shows one lajur at a time and moves on by itself.
  const usesTimedGridView = scorerType === "TIMED_GRID";
  // A drawing box holds one picture, uploaded by the view itself.
  const usesManualView = scorerType === "MANUAL";
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

  /**
   * A ranking grows one click at a time. The view already keeps the numbers
   * contiguous, so the item is complete the moment the last option gets a rank.
   */
  const rank = useCallback(
    (ranks: number[]) => {
      if (!item) return;
      answers.answer(item.id, { ranks });
      if (ranks.every((value) => value > 0) && !isLast) advance();
    },
    [advance, answers, isLast, item],
  );

  /**
   * A marked list holds many judgements, so the runner never advances on its
   * own — the participant decides when the list is done.
   */
  const mark = useCallback(
    (next: MarkState) => {
      if (!item) return;
      answers.answer(item.id, next);
    },
    [answers, item],
  );

  /** A Likert item holds one rating, so a single click is a complete answer. */
  const rate = useCallback(
    (rating: number) => {
      if (!item) return;
      answers.answer(item.id, { rating });
      if (!isLast) advance();
    },
    [advance, answers, isLast, item],
  );

  /** A three-option item holds one pick, so a single click is complete too. */
  const chooseOption = useCallback(
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

  /**
   * One lajur is one answer, saved on a pause. The view keeps the draft locally
   * and only reports a filled row, so a lajur of 27 gaps is one PUT instead of
   * 27 — and a lajur abandoned at the buzzer still keeps its first digits.
   */
  const answerTimedGrid = useCallback(
    (next: (number | null)[]) => {
      if (!item) return;
      answers.answerDebounced(item.id, { answers: next }, TIMED_GRID_SAVE_MS);
    },
    [answers, item],
  );

  /** The last gap filled: push the lajur to the server and open the next one. */
  const finishTimedGridColumn = useCallback(() => {
    answers.flushPendingText();
    if (!isLast) goNext();
  }, [answers, goNext, isLast]);

  /**
   * The upload already happened inside the view, which answers with the path
   * the server stored. Recording it here is what makes the box count as
   * answered — the PNG itself never travels through this hook.
   */
  const saveManualDrawing = useCallback(
    (imageUrl: string) => {
      if (!item) return;
      answers.answer(item.id, { imageUrl });
    },
    [answers, item],
  );

  // Partial DISC picks must still render on return, so the raw value goes
  // through as-is; the view already treats a missing half as "not picked".
  const discValue =
    usesChoiceView ||
    isPair ||
    usesRatingView ||
    usesRankView ||
    usesMarkView ||
    usesOptionView ||
    usesManualView ||
    usesTimedGridView
      ? undefined
      : (rawValue as DiscResponse | undefined);

  return {
    usesChoiceView,
    usesRatingView,
    usesRankView,
    usesMarkView,
    usesOptionView,
    usesTimedGridView,
    usesManualView,
    isPair,
    total,
    safeIndex,
    item,
    discValue,
    timedGridAnswers: toTimedGridAnswers(rawValue),
    manualImageUrl: toManualImage(rawValue),
    pairChoice: toPairChoice(rawValue),
    optionChoice: toOptionChoice(rawValue),
    rating: toRating(rawValue),
    ranks: toRanks(rawValue),
    marks: toMarks(rawValue),
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
    savingFailed: answers.savingFailed,
    canRetryFailed: answers.canRetryFailed,
    retryFailed: answers.retryFailed,
    answeredCount: answers.answeredCount,
    remainingSeconds,
    timeUp,
    selectDisc,
    chooseRightWrong,
    choosePair,
    chooseOption,
    rate,
    rank,
    mark,
    typeRightWrong,
    answerTimedGrid,
    finishTimedGridColumn,
    saveManualDrawing,
    goNext,
    goPrev,
    finish,
    goTo,
  };
}
