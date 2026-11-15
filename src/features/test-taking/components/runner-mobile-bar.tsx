"use client";

import { Button } from "@/components/ui/button";
import { QuestionNavigator } from "./question-navigator";

interface RunnerMobileBarProps {
  total: number;
  answered: boolean[];
  activeIndex: number;
  atStart: boolean;
  isLast: boolean;
  currentAnswered: boolean;
  completing: boolean;
  /**
   * A timed grid may not be walked back through: a lajur already left keeps
   * its gaps, and reopening it would turn a real "terlewati" into a filled
   * cell. Locks the map and the back button.
   */
  locked?: boolean;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

/**
 * Mobile/tablet: the same controls pinned to the top so the question can use
 * the full width and scroll underneath.
 */
export function RunnerMobileBar({
  total,
  answered,
  activeIndex,
  atStart,
  isLast,
  currentAnswered,
  completing,
  locked = false,
  onSelect,
  onPrev,
  onNext,
  onFinish,
}: RunnerMobileBarProps) {
  return (
    <div className="sticky top-0 z-40 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
      <div className="flex flex-col gap-2">
        {locked ? null : (
          <QuestionNavigator
            total={total}
            answered={answered}
            activeIndex={activeIndex}
            onSelect={onSelect}
            orientation="horizontal"
          />
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onPrev}
            disabled={atStart || locked}
          >
            Sebelumnya
          </Button>
          <p className="shrink-0 px-1 text-xs font-medium text-muted-foreground tabular-nums">
            {activeIndex + 1} / {total}
          </p>
          {isLast ? (
            <Button
              size="sm"
              className="flex-1"
              onClick={onFinish}
              disabled={completing || !currentAnswered}
            >
              {completing ? "Mengirim..." : "Kirim"}
            </Button>
          ) : (
            <Button size="sm" className="flex-1" onClick={onNext} disabled={!currentAnswered}>
              Lanjut
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
