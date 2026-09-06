"use client";

import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  total: number;
  /** Parallel to question order — true once the question is answered. */
  answered: boolean[];
  activeIndex: number;
  onSelect: (index: number) => void;
  orientation: "vertical" | "horizontal";
}

/**
 * Question map: answered = solid blue, current = ring, unanswered = outline.
 * Lets the participant jump freely — answers are saved per question.
 */
export function QuestionNavigator({
  total,
  answered,
  activeIndex,
  onSelect,
  orientation,
}: QuestionNavigatorProps) {
  const numbers = Array.from({ length: total }, (_, i) => i);

  return (
    <nav
      aria-label="Peta soal"
      className={cn(
        orientation === "vertical" && "grid grid-cols-5 gap-1.5",
        orientation === "horizontal" && "flex gap-1.5 overflow-x-auto pb-1",
      )}
    >
      {numbers.map((number) => {
        const isActive = number === activeIndex;
        const isAnswered = answered[number];
        return (
          <button
            key={number}
            type="button"
            onClick={() => onSelect(number)}
            aria-label={`Soal ${number + 1}${isAnswered ? " (terjawab)" : " (belum dijawab)"}`}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
              isAnswered
                ? "border-transparent bg-primary/15 text-primary"
                : "border-dashed text-muted-foreground hover:border-primary/50 hover:text-foreground",
              isActive && "ring-2 ring-primary ring-offset-1 ring-offset-background",
            )}
          >
            {number + 1}
          </button>
        );
      })}
    </nav>
  );
}
