"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PairItemViewProps {
  order: number;
  question: string | null;
  statements: string[];
  value: number | null;
  disabled: boolean;
  onChoose: (index: number) => void;
}

const SIDE_LABEL = ["A", "B"];

/**
 * One forced-choice pair: a stem and two statements, exactly one of which the
 * participant picks. The pole each statement scores is never part of the
 * payload, so nothing here can leak the key.
 */
export function PairItemView({
  order,
  question,
  statements,
  value,
  disabled,
  onChoose,
}: PairItemViewProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Soal {order}
      </p>
      {question && <p className="text-base font-medium leading-relaxed">{question}</p>}
      <div className="grid gap-3">
        {statements.map((statement, idx) => {
          const selected = value === idx;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChoose(idx)}
              className={cn(
                "flex items-start gap-3 rounded-xl border bg-card p-4 text-left text-sm transition-colors",
                selected
                  ? "border-primary bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  selected ? "border-primary bg-primary text-primary-foreground" : "",
                )}
              >
                {selected ? <Check className="size-3.5" aria-hidden /> : SIDE_LABEL[idx]}
              </span>
              <span className="leading-relaxed">{statement}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Pilih satu pernyataan yang paling sesuai.</p>
    </div>
  );
}
