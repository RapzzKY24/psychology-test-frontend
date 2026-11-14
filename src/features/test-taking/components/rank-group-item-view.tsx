"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RankGroupItemViewProps {
  order: number;
  /** "Kelompok A" — the group label, not a question. */
  question: string | null;
  /** The occupations for this participant's declared sex. */
  options: string[];
  /** One rank per option in option order; 0 = not ranked yet. */
  ranks: number[];
  disabled: boolean;
  onRank: (ranks: number[]) => void;
}

/**
 * RMIB asks for a complete ordering, not a pick: the participant clicks the
 * occupations one by one, from the one they like most to the one they like
 * least. Each click appends the next number; clicking a ranked row takes it out
 * again and closes the gap, so the ranks always stay 1..N without duplicates.
 */
export function RankGroupItemView({
  order,
  question,
  options,
  ranks,
  disabled,
  onRank,
}: RankGroupItemViewProps) {
  const filled = options.map((_, index) => ranks[index] ?? 0);
  const rankedCount = filled.filter((rank) => rank > 0).length;
  const nextRank = rankedCount + 1;

  const toggle = (index: number) => {
    if (disabled) return;
    const current = filled[index] ?? 0;
    if (current > 0) {
      // Pull it out and shift every higher rank down, keeping 1..N contiguous.
      onRank(filled.map((rank) => (rank > current ? rank - 1 : rank === current ? 0 : rank)));
      return;
    }
    onRank(filled.map((rank, i) => (i === index ? nextRank : rank)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Soal {order}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          Terurut {rankedCount} dari {options.length}
        </p>
      </div>

      {question && <p className="text-lg font-medium leading-snug">{question}</p>}

      <p className="text-sm text-muted-foreground">
        Klik pekerjaan satu per satu, mulai dari yang paling Anda sukai. Nomor urut muncul di kiri
        setiap baris — nomor 1 untuk yang paling disukai, {options.length} untuk yang paling tidak
        disukai.
      </p>

      <div className="space-y-2">
        {options.map((option, index) => {
          const rank = filled[index] ?? 0;
          const ranked = rank > 0;
          return (
            <button
              key={`${option}-${index}`}
              type="button"
              disabled={disabled}
              aria-pressed={ranked}
              aria-label={ranked ? `${option} — urutan ${rank}` : `${option} — belum diurutkan`}
              onClick={() => toggle(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                ranked
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/40 hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold tabular-nums",
                  ranked
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "text-muted-foreground",
                )}
                aria-hidden
              >
                {ranked ? rank : "–"}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Jawaban tersimpan otomatis. Klik baris yang sudah bernomor untuk membatalkannya.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || rankedCount === 0}
          onClick={() => onRank(options.map(() => 0))}
        >
          <RotateCcw className="size-4" aria-hidden />
          Ulangi
        </Button>
      </div>
    </div>
  );
}
