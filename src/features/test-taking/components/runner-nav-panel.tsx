"use client";

import { Separator } from "@/components/ui/separator";
import { ElapsedTimer } from "./elapsed-timer";
import { NavButtons } from "./nav-buttons";
import { QuestionNavigator } from "./question-navigator";

interface RunnerNavPanelProps {
  total: number;
  answered: boolean[];
  activeIndex: number;
  running: boolean;
  atStart: boolean;
  isLast: boolean;
  currentAnswered: boolean;
  allAnswered: boolean;
  completing: boolean;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

/** Desktop right column: timer, position, question map, prev/next. */
export function RunnerNavPanel({
  total,
  answered,
  activeIndex,
  running,
  atStart,
  isLast,
  currentAnswered,
  allAnswered,
  completing,
  onSelect,
  onPrev,
  onNext,
  onFinish,
}: RunnerNavPanelProps) {
  return (
    <aside
      className="hidden shrink-0 flex-col gap-4 rounded-xl border bg-card p-4 lg:sticky lg:top-6 lg:order-2 lg:flex lg:w-72"
      aria-label="Navigasi soal dan waktu"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Waktu</span>
        <ElapsedTimer running={running} />
      </div>
      <Separator />
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Posisi soal</p>
        <p className="text-lg font-semibold tabular-nums">
          Soal {activeIndex + 1}{" "}
          <span className="text-sm font-normal text-muted-foreground">dari {total}</span>
        </p>
      </div>
      <QuestionNavigator
        total={total}
        answered={answered}
        activeIndex={activeIndex}
        onSelect={onSelect}
        orientation="vertical"
      />
      <Separator />
      <NavButtons
        stacked
        atStart={atStart}
        isLast={isLast}
        currentAnswered={currentAnswered}
        allAnswered={allAnswered}
        completing={completing}
        onPrev={onPrev}
        onNext={onNext}
        onFinish={onFinish}
      />
    </aside>
  );
}
