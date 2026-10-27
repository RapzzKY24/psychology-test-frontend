"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { DiscItemView } from "./disc-item-view";
import { RightWrongItemView } from "./right-wrong-item-view";
import { ElapsedTimer } from "./elapsed-timer";
import { QuestionNavigator } from "./question-navigator";
import { useAttemptAnswers } from "../hooks/use-attempt-answers";
import { resolveScorerType } from "../registry";
import type { AttemptRead, ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";

interface AttemptRunnerProps {
  attempt: AttemptRead;
  participantToken: string | null;
  homeHref: string;
}

const INSTRUCTIONS: Record<ScorerType, React.ReactNode> = {
  FORCED_CHOICE_DISC: (
    <>
      Pilih satu kata yang <span className="font-medium text-foreground">paling sesuai</span> dan
      satu yang <span className="font-medium text-foreground">paling tidak sesuai</span> dengan diri
      Anda. Jawaban tersimpan otomatis — boleh kembali ke soal sebelumnya.
    </>
  ),
  RIGHT_WRONG_NORM: <>Pilih satu jawaban untuk setiap soal. Jawaban tersimpan otomatis.</>,
};

function isAnsweredDisc(value: unknown): value is DiscResponse {
  const v = value as DiscResponse | undefined;
  return v !== undefined && v.most >= 0 && v.least >= 0;
}

interface NavButtonsProps {
  atStart: boolean;
  isLast: boolean;
  currentAnswered: boolean;
  allAnswered: boolean;
  completing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  /** Panel layout: buttons stack full-width instead of sitting side by side. */
  stacked?: boolean;
}

function NavButtons({
  atStart,
  isLast,
  currentAnswered,
  allAnswered,
  completing,
  onPrev,
  onNext,
  onFinish,
  stacked = false,
}: NavButtonsProps) {
  const full = stacked ? "w-full" : undefined;

  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "items-center justify-between")}>
      <Button variant="outline" onClick={onPrev} disabled={atStart} className={full}>
        Sebelumnya
      </Button>
      {isLast ? (
        <Button onClick={onFinish} disabled={completing || !currentAnswered} className={full}>
          {completing ? "Mengirim..." : allAnswered ? "Kirim Semua Jawaban" : "Selesai & Kirim"}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!currentAnswered} className={full}>
          Lanjut
        </Button>
      )}
    </div>
  );
}

export function AttemptRunner({ attempt, participantToken, homeHref }: AttemptRunnerProps) {
  const scorerType = resolveScorerType(attempt);
  const isRightWrong = scorerType === "RIGHT_WRONG_NORM";
  const answers = useAttemptAnswers(attempt, participantToken, scorerType, () => {});
  const [index, setIndex] = useState(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const total = attempt.items.length;
  const safeIndex = Math.min(index, Math.max(total - 1, 0));
  const item = attempt.items[safeIndex];
  const rawValue = item ? answers.answers[item.id] : undefined;
  const currentAnswered = isRightWrong
    ? (rawValue as { chosen?: unknown } | undefined)?.chosen !== undefined
    : isAnsweredDisc(rawValue);
  const isLast = safeIndex === total - 1;
  const allAnswered = answers.answeredCount === total;

  const onSelectDisc = (part: "most" | "least", wordIndex: number) => {
    if (!item) return;
    const current = isAnsweredDisc(rawValue) ? rawValue : { most: -1, least: -1 };
    const next = { ...current, [part]: wordIndex };
    if (next.most >= 0 && next.least >= 0 && next.most === next.least) {
      setDuplicateWarning("Kata Most dan Least tidak boleh sama.");
      return;
    }
    setDuplicateWarning(null);
    answers.answer(item.id, next);
    if (next.most >= 0 && next.least >= 0 && !isLast) {
      window.setTimeout(() => setIndex((currentIdx) => Math.min(currentIdx + 1, total - 1)), 400);
    }
  };

  const onSelectRightWrong = (chosen: number) => {
    if (!item) return;
    answers.answer(item.id, { chosen });
    if (!isLast) window.setTimeout(() => setIndex((c) => Math.min(c + 1, total - 1)), 300);
  };

  const goNext = () => {
    setDuplicateWarning(null);
    setIndex((current) => Math.min(current + 1, total - 1));
  };

  const goPrev = () => {
    setDuplicateWarning(null);
    setIndex((current) => Math.max(current - 1, 0));
  };

  const finish = () => {
    const missing = answers.tryComplete();
    if (missing) {
      const idx = attempt.items.findIndex((it) => it.id === missing);
      if (idx !== -1) setIndex(idx);
    }
  };

  if (answers.completed) {
    return <AttemptCompleteScreen homeHref={homeHref} />;
  }

  const answered = attempt.items.map((it) =>
    isRightWrong
      ? (answers.answers[it.id] as { chosen?: unknown } | undefined)?.chosen !== undefined
      : isAnsweredDisc(answers.answers[it.id]),
  );

  const content = (item?.content ?? {}) as Record<string, unknown>;

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-4 pt-4 pb-10 sm:px-6 lg:flex-row lg:items-start lg:gap-8 lg:py-10">
      {/* Mobile/tablet: navigation sits on top and stays put while the question
          scrolls underneath. Hidden from lg up. */}
      <div className="sticky top-0 z-40 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex flex-col gap-2">
          <QuestionNavigator
            total={total}
            answered={answered}
            activeIndex={safeIndex}
            onSelect={setIndex}
            orientation="horizontal"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={goPrev}
              disabled={safeIndex === 0}
            >
              Sebelumnya
            </Button>
            <p className="shrink-0 px-1 text-xs font-medium text-muted-foreground tabular-nums">
              {safeIndex + 1} / {total}
            </p>
            {isLast ? (
              <Button
                size="sm"
                className="flex-1"
                onClick={finish}
                disabled={answers.completing || !currentAnswered}
              >
                {answers.completing ? "Mengirim..." : "Kirim"}
              </Button>
            ) : (
              <Button size="sm" className="flex-1" onClick={goNext} disabled={!currentAnswered}>
                Lanjut
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-6 lg:order-1 lg:w-auto lg:flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="font-medium">{attempt.testName}</p>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground tabular-nums">
                {answers.answeredCount} dari {total} terjawab
              </span>
              <span className="lg:hidden">
                <ElapsedTimer running={!answers.completed} />
              </span>
            </div>
          </div>
          <Progress
            value={total === 0 ? 0 : (answers.answeredCount / total) * 100}
            aria-label="Progres pengerjaan"
          />
          <p className="text-xs text-muted-foreground">{INSTRUCTIONS[scorerType]}</p>
        </div>

        {isRightWrong ? (
          <RightWrongItemView
            order={safeIndex + 1}
            question={(content.question as string | null) ?? null}
            imageUrl={(content.imageUrl as string | null) ?? null}
            options={(content.options as string[]) ?? []}
            value={(rawValue as { chosen?: number } | undefined)?.chosen}
            disabled={false}
            onSelect={onSelectRightWrong}
          />
        ) : (
          <DiscItemView
            order={safeIndex + 1}
            words={(content.words as string[]) ?? []}
            value={isAnsweredDisc(rawValue) ? rawValue : undefined}
            duplicateWarning={duplicateWarning}
            disabled={false}
            onSelect={onSelectDisc}
          />
        )}
      </div>

      {/* Desktop navigation panel — right column, sticky. */}
      <aside
        className="hidden shrink-0 flex-col gap-4 rounded-xl border bg-card p-4 lg:sticky lg:top-6 lg:order-2 lg:flex lg:w-72"
        aria-label="Navigasi soal dan waktu"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Waktu</span>
          <ElapsedTimer running={!answers.completed} />
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Posisi soal</p>
          <p className="text-lg font-semibold tabular-nums">
            Soal {safeIndex + 1}{" "}
            <span className="text-sm font-normal text-muted-foreground">dari {total}</span>
          </p>
        </div>
        <QuestionNavigator
          total={total}
          answered={answered}
          activeIndex={safeIndex}
          onSelect={setIndex}
          orientation="vertical"
        />
        <Separator />
        <NavButtons
          stacked
          atStart={safeIndex === 0}
          isLast={isLast}
          currentAnswered={currentAnswered}
          allAnswered={allAnswered}
          completing={answers.completing}
          onPrev={goPrev}
          onNext={goNext}
          onFinish={finish}
        />
      </aside>
    </main>
  );
}
