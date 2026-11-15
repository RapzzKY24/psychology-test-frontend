"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarkState } from "../lib/answer-state";

interface MarkGroupItemViewProps {
  order: number;
  /** "Kelompok 1" — the list label, not a question. */
  question: string | null;
  /** The activities of this list. */
  options: string[];
  marks: MarkState;
  disabled: boolean;
  onChange: (marks: MarkState) => void;
}

/**
 * KUDER asks for a judgement per activity, not an order: `+` for something the
 * participant likes, `-` for something they do not, and no mark at all when
 * they have no opinion. Clicking the active mark takes it back, so a row is
 * never on both sides at once.
 */
export function MarkGroupItemView({
  order,
  question,
  options,
  marks,
  disabled,
  onChange,
}: MarkGroupItemViewProps) {
  const markOf = (index: number): "liked" | "disliked" | null =>
    marks.liked.includes(index)
      ? "liked"
      : marks.disliked.includes(index)
        ? "disliked"
        : null;

  const toggle = (index: number, kind: "liked" | "disliked") => {
    if (disabled) return;
    const next: MarkState = {
      liked: marks.liked.filter((value) => value !== index),
      disliked: marks.disliked.filter((value) => value !== index),
    };
    if (markOf(index) !== kind) next[kind].push(index);
    next.liked.sort((a, b) => a - b);
    next.disliked.sort((a, b) => a - b);
    onChange(next);
  };

  const marked = marks.liked.length + marks.disliked.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Soal {order}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          Ditandai {marked} dari {options.length}
        </p>
      </div>

      {question && <p className="text-lg font-medium leading-snug">{question}</p>}

      <p className="text-sm text-muted-foreground">
        Tandai <span className="font-medium text-foreground">+</span> untuk aktivitas yang Anda
        sukai dan <span className="font-medium text-foreground">−</span> untuk yang tidak. Biarkan
        kosong bila Anda tidak punya pendapat. Klik tanda yang sama sekali lagi untuk
        membatalkannya.
      </p>

      <div className="overflow-hidden rounded-lg border">
        {options.map((option, index) => {
          const mark = markOf(index);
          return (
            <div
              key={`${option}-${index}`}
              className={cn(
                "flex items-center gap-3 border-b px-3 py-2.5 text-sm last:border-b-0",
                mark === "liked" && "bg-primary/5",
                mark === "disliked" && "bg-destructive/5",
              )}
            >
              <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={disabled}
                  aria-pressed={mark === "liked"}
                  aria-label={`${option} — suka`}
                  onClick={() => toggle(index, "liked")}
                  className={cn(
                    "size-8",
                    mark === "liked" && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={disabled}
                  aria-pressed={mark === "disliked"}
                  aria-label={`${option} — tidak suka`}
                  onClick={() => toggle(index, "disliked")}
                  className={cn(
                    "size-8",
                    mark === "disliked" &&
                      "border-destructive/40 bg-destructive/10 text-destructive",
                  )}
                >
                  <Minus className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Jawaban tersimpan otomatis. Minimal satu tanda per kelompok sebelum lanjut.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || marked === 0}
          onClick={() => onChange({ liked: [], disliked: [] })}
        >
          <RotateCcw className="size-4" aria-hidden />
          Ulangi
        </Button>
      </div>
    </div>
  );
}
