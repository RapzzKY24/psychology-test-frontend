"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { DiscItemView } from "./disc-item-view";
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

  const onSelect = (part: "most" | "least", wordIndex: number) => {
    if (!item) return;
    const warning = answers.answer(item.id, part, wordIndex);
    setDuplicateWarning(warning);
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

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium">{attempt.testName}</p>
          <p className="text-muted-foreground tabular-nums">
            {answers.answeredCount} dari {total}
          </p>
        </div>
        <Progress value={(answers.answeredCount / total) * 100} aria-label="Progres pengerjaan" />
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
            {answers.completing ? "Mengirim..." : "Selesai & Kirim"}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!currentAnswered}>
            Lanjut
          </Button>
        )}
      </div>
    </main>
  );
}
