"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { DiscItemView } from "./disc-item-view";
import { ElapsedTimer } from "./elapsed-timer";
import { QuestionNavigator } from "./question-navigator";
import { useDiscAnswers } from "../hooks/use-disc-answers";
import type { AttemptRead, DiscResponse } from "@/lib/api/types";

interface AttemptRunnerProps {
  attempt: AttemptRead;
  participantToken: string | null;
  homeHref: string;
}

function isAnswered(value: DiscResponse | undefined): boolean {
  return value !== undefined && value.most >= 0 && value.least >= 0;
}

export function AttemptRunner({ attempt, participantToken, homeHref }: AttemptRunnerProps) {
  const answers = useDiscAnswers(attempt, participantToken, () => {});
  const [index, setIndex] = useState(0);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const total = attempt.items.length;
  const safeIndex = Math.min(index, Math.max(total - 1, 0));
  const item = attempt.items[safeIndex];
  const value = item ? answers.answers[item.id] : undefined;
  const currentAnswered = isAnswered(value);
  const isLast = safeIndex === total - 1;
  const allAnswered = answers.answeredCount === total;

  const onSelect = (part: "most" | "least", wordIndex: number) => {
    if (!item) return;
    const warning = answers.answer(item.id, part, wordIndex);
    setDuplicateWarning(warning);
    if (warning) return;
    // Smooth flow: when the pair completes, ease to the next question.
    const prospective = { ...(value ?? { most: -1, least: -1 }), [part]: wordIndex };
    if (prospective.most >= 0 && prospective.least >= 0 && !isLast) {
      window.setTimeout(() => setIndex((current) => Math.min(current + 1, total - 1)), 400);
    }
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

  const answered = attempt.items.map((it) => isAnswered(answers.answers[it.id]));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10 lg:flex-row-reverse lg:items-start">
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

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium">{attempt.testName}</p>
            <p className="text-muted-foreground tabular-nums">
              {answers.answeredCount} dari {total} terjawab
            </p>
          </div>
          <Progress value={(answers.answeredCount / total) * 100} aria-label="Progres pengerjaan" />
          <p className="text-xs text-muted-foreground">
            Pilih satu kata yang <span className="font-medium text-foreground">paling sesuai</span>{" "}
            dan satu yang{" "}
            <span className="font-medium text-foreground">paling tidak sesuai</span> dengan diri
            Anda. Jawaban tersimpan otomatis — boleh kembali ke soal sebelumnya.
          </p>
        </div>

        <DiscItemView
          order={safeIndex + 1}
          words={(item?.content.words as string[]) ?? []}
          value={value}
          duplicateWarning={duplicateWarning}
          disabled={false}
          onSelect={onSelect}
        />

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
