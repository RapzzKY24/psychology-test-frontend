"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionScaleItemViewProps {
  order: number;
  /** The statement, already stripped of its hidden factor by the API. */
  text: string;
  /** The three printed answers (a/b/c), in the order the sheet prints them. */
  options: string[];
  chosen: number | null;
  disabled: boolean;
  onChoose: (index: number) => void;
}

const OPTION_LABEL = ["a", "b", "c", "d", "e", "f"];

/**
 * 16PF's item screen: one statement and its three printed answers. The factor
 * each option feeds and the direction of the scale never reach the browser —
 * the API sends `{ text, options }` only.
 */
export function OptionScaleItemView({
  order,
  text,
  options,
  chosen,
  disabled,
  onChoose,
}: OptionScaleItemViewProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Soal {order}
      </p>

      <p className="whitespace-pre-wrap text-lg font-medium leading-snug">{text}</p>

      <div className="grid gap-3">
        {options.map((option, idx) => {
          const selected = chosen === idx;
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
                {selected ? <Check className="size-3.5" aria-hidden /> : OPTION_LABEL[idx]}
              </span>
              <span className="leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Pilih satu jawaban yang paling menggambarkan diri Anda. Jawaban tersimpan otomatis.
      </p>
    </div>
  );
}
