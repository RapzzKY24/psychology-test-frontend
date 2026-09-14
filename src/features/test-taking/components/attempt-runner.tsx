"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
      Pilih satu kata yang <span className="font-medium text-foreground">paling sesuai</span>{" "}
      dan satu yang <span className="font-medium text-foreground">paling tidak sesuai</span>{" "}
      dengan diri Anda. Jawaban tersimpan otomatis — boleh kembali ke soal sebelumnya.
    </>
  ),
  RIGHT_WRONG_NORM: (
    <>Pilih satu jawaban untuk setiap soal. Jawaban tersimpan otomatis.</>
  ),
};

function isAnsweredDisc(value: unknown): value is DiscResponse {
  const v = value as DiscResponse | undefined;
  return v !== undefined && v.most >= 0 && v.least >= 0;
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10 lg:flex-row-reverse lg:items-start">
      <aside
        className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:sticky lg:top-6 lg:w-64"
        aria-label="Navigasi soal dan waktu"
      >
        <div className="flex items-center justify-between lg:justify-center">
          <ElapsedTimer running={!answers.completed} />
        </div>
        <div className="hidden lg:block">
          <QuestionNavigator
            total={total}
            answered={answered}
            activeIndex={safeIndex}
            onSelect={setIndex}
            orientation="vertical"
          />
        </div>
        <div className="lg:hidden">
          <QuestionNavigator
            total={total}
            answered={answered}
            activeIndex={safeIndex}
            onSelect={setIndex}
            orientation="horizontal"
          />
        </div>
      </aside>

      <div className="flex w-full flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium">{attempt.testName}</p>
            <p className="text-muted-foreground tabular-nums">
              {answers.answeredCount} dari {total} terjawab
            </p>
          </div>
          <Progress value={total === 0 ? 0 : (answers.answeredCount / total) * 100} aria-label="Progres pengerjaan" />
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

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goPrev} disabled={safeIndex === 0}>
            Sebelumnya
          </Button>
          {isLast ? (
            <Button onClick={finish} disabled={answers.completing || !currentAnswered}>
              {answers.completing
                ? "Mengirim..."
                : allAnswered
                  ? "Kirim Semua Jawaban"
                  : "Selesai & Kirim"}
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!currentAnswered}>
              Lanjut
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
