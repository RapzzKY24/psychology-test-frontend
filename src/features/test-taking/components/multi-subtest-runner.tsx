"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { AttemptSaveAlert } from "./attempt-save-alert";
import { ElapsedTimer } from "./elapsed-timer";
import { MultiSubtestItemView } from "./multi-subtest-item-view";
import { useAttemptAnswers } from "../hooks/use-attempt-answers";
import { useSubtestClock } from "../hooks/use-subtest-clock";
import { isAnsweredValue, toSubtestAnswer } from "../lib/answer-state";
import { cn } from "@/lib/utils";
import type { AttemptRead } from "@/lib/api/types";

/** A pick is complete on its own; a short pause keeps the screen readable. */
const PICK_ADVANCE_MS = 300;

interface MultiSubtestRunnerProps {
  attempt: AttemptRead;
  participantToken: string | null;
  homeHref: string;
}

/**
 * A battery, not a questionnaire: nine subtests, each with its own window, its
 * own item list and no way back. The generic runner lets the participant walk
 * the whole list, which would let them answer a subtest whose clock already
 * closed — so the battery gets its own composition.
 */
export function MultiSubtestRunner({
  attempt,
  participantToken,
  homeHref,
}: MultiSubtestRunnerProps) {
  const answers = useAttemptAnswers(attempt, participantToken, "MULTI_SUBTEST", () => {});
  const clock = useSubtestClock(attempt);
  const [index, setIndex] = useState(0);
  const advanceTimer = useRef<number | null>(null);

  const active = clock.current;
  const activeCode = active?.subtest.code ?? null;

  // A new subtest always opens on its first item; the previous one is gone.
  const [seenCode, setSeenCode] = useState<string | null>(activeCode);
  if (activeCode !== seenCode) {
    setSeenCode(activeCode);
    setIndex(0);
  }

  // Anything typed but not yet sent belongs to the subtest that is closing.
  const flushPendingText = answers.flushPendingText;
  useEffect(() => {
    flushPendingText();
  }, [activeCode, flushPendingText]);

  const itemFrom = active?.subtest.itemFrom ?? 0;
  const itemTo = active?.subtest.itemTo ?? 0;
  const subtestItems = useMemo(() => {
    // Item orders start at 1, so 0 means no window is open at all.
    if (itemFrom === 0) return [];
    return attempt.items.filter((item) => item.order >= itemFrom && item.order <= itemTo);
  }, [attempt.items, itemFrom, itemTo]);
  const failedWindowClosed = answers.failedItemIds.some(
    (id) => !subtestItems.some((item) => item.id === id),
  );

  const safeIndex = Math.min(index, Math.max(subtestItems.length - 1, 0));
  const item = subtestItems[safeIndex];
  const value = item ? answers.answers[item.id] : undefined;
  const answered = subtestItems.map((row) => isAnsweredValue("MULTI_SUBTEST", answers.answers[row.id]));
  const answeredCount = answered.filter(Boolean).length;
  const isLast = safeIndex === subtestItems.length - 1;

  const submittedRef = useRef(false);
  useEffect(() => {
    if (!clock.finished || submittedRef.current) return;
    submittedRef.current = true;
    void answers.submit();
  }, [clock.finished, answers]);

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  const goNext = useCallback(() => {
    cancelAdvance();
    setIndex((current) => Math.min(current + 1, Math.max(subtestItems.length - 1, 0)));
  }, [cancelAdvance, subtestItems.length]);

  const choose = useCallback(
    (letter: string) => {
      if (!item) return;
      answers.answer(item.id, { answer: letter });
      if (!isLast) {
        cancelAdvance();
        advanceTimer.current = window.setTimeout(() => {
          advanceTimer.current = null;
          setIndex((current) => Math.min(current + 1, Math.max(subtestItems.length - 1, 0)));
        }, PICK_ADVANCE_MS);
      }
    },
    [answers, cancelAdvance, isLast, item, subtestItems.length],
  );

  // Typing reaches the server on a pause, so a burst of keystrokes is one PUT.
  const type = useCallback(
    (answer: string) => {
      if (!item) return;
      answers.answerDebounced(item.id, { answer });
    },
    [answers, item],
  );

  if (answers.completed) {
    return <AttemptCompleteScreen homeHref={homeHref} />;
  }

  if (!active) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-6 py-24 text-center">
        {answers.savingFailed ? (
          <AttemptSaveAlert attemptId={attempt.id} expired canRetry={false} onRetry={() => {}} />
        ) : (
          <p className="text-sm text-muted-foreground">Menyiapkan hasil…</p>
        )}
      </main>
    );
  }

  const { subtest, phase, remainingSec } = active;
  const total = attempt.subtests.length;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 pt-4 pb-10 sm:px-6 lg:py-8">
      {answers.savingFailed ? (
        <AttemptSaveAlert
          attemptId={attempt.id}
          expired={clock.finished || failedWindowClosed}
          canRetry={answers.canRetryFailed && !failedWindowClosed}
          onRetry={() => void answers.retryFailed()}
        />
      ) : null}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {attempt.testName} · subtes {active.index + 1} dari {total}
            </p>
            <h1 className="truncate text-lg font-semibold">{subtest.name}</h1>
          </div>
          <ElapsedTimer running remainingSeconds={remainingSec} />
        </div>
        <Progress
          value={total === 0 ? 0 : ((active.index + 1) / total) * 100}
          aria-label="Progres subtes"
        />
        <p className="text-xs text-muted-foreground">{subtest.instruction}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <Card>
          <CardContent className="space-y-6 p-5 sm:p-6">
            {phase === "memorize" ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-xl border bg-primary/5 p-4">
                  <Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Hafalkan kata-kata berikut</p>
                    <p className="text-sm text-muted-foreground">
                      Daftar ini akan ditutup otomatis dan tidak bisa dibuka lagi. Setelah itu Anda
                      menjawab soal tentang kata-kata tersebut.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {subtest.memorizeList.map((group) => (
                    <div key={group.label} className="rounded-lg border bg-primary/5 p-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed">{group.words.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : item ? (
              <MultiSubtestItemView
                key={item.id}
                order={item.order}
                content={item.content}
                answer={toSubtestAnswer(value)}
                disabled={false}
                onChoose={choose}
                onType={type}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Subtes ini tidak memuat soal.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-6">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Soal subtes ini</span>
                <span className="tabular-nums">
                  {answeredCount} / {subtestItems.length}
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
                {subtestItems.map((row, rowIndex) => (
                  <button
                    key={row.id}
                    type="button"
                    disabled={phase === "memorize"}
                    aria-label={`Soal ${row.order}`}
                    aria-current={rowIndex === safeIndex}
                    onClick={() => {
                      cancelAdvance();
                      setIndex(rowIndex);
                    }}
                    className={cn(
                      "flex h-8 items-center justify-center rounded-md border text-xs tabular-nums transition-colors",
                      rowIndex === safeIndex
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : answered[rowIndex]
                          ? "border-primary/40 bg-primary/5 text-foreground"
                          : "text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {row.order}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Urutan subtes
              </p>
              <ul className="space-y-1 text-sm">
                {attempt.subtests.map((row, rowIndex) => {
                  const done = rowIndex < active.index;
                  const current = rowIndex === active.index;
                  return (
                    <li
                      key={row.code}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md px-2 py-1.5",
                        current ? "bg-primary/5 font-medium" : "text-muted-foreground",
                      )}
                    >
                      <span className="truncate">
                        {rowIndex + 1}. {row.name}
                      </span>
                      {done ? (
                        <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                      ) : current ? null : (
                        <Lock className="size-3.5 shrink-0" aria-hidden />
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={phase === "memorize" || safeIndex === 0}
          onClick={() => {
            cancelAdvance();
            setIndex((current) => Math.max(current - 1, 0));
          }}
        >
          Sebelumnya
        </Button>
        <p className="text-xs text-muted-foreground">
          {isLast
            ? "Subtes ditutup otomatis saat waktu habis."
            : "Subtes berpindah sendiri saat waktu habis."}
        </p>
        <Button
          type="button"
          disabled={phase === "memorize" || isLast}
          onClick={goNext}
        >
          Berikutnya
        </Button>
      </div>
    </main>
  );
}
