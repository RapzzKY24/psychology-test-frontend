"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavButtonsProps {
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

export function NavButtons({
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
