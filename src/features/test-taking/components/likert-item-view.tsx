"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikertItemViewProps {
  order: number;
  /** The statement, already stripped of its hidden scale by the API. */
  text: string;
  /** Rating bounds travel with the item (Big Five 1–5, Enneagram 0–3). */
  min: number;
  max: number;
  /** What each point means, lowest first — only the instrument knows. */
  labels?: string[];
  rating: number | null;
  disabled: boolean;
  onRate: (rating: number) => void;
}

/** Only a five-point scale has the familiar "sangat tidak / sangat sesuai" ends. */
const END_LABELS: Record<number, [string, string]> = {
  5: ["Sangat tidak sesuai", "Sangat sesuai"],
};

export function LikertItemView({
  order,
  text,
  min,
  max,
  labels,
  rating,
  disabled,
  onRate,
}: LikertItemViewProps) {
  const values = Array.from({ length: Math.max(max - min + 1, 1) }, (_, i) => min + i);
  // A label list only makes sense one-per-point; anything else falls back.
  const legend = labels?.length === values.length ? labels : undefined;
  const ends = legend ? undefined : END_LABELS[values.length];

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Soal {order}
      </p>

      <p className="whitespace-pre-wrap text-lg font-medium leading-snug">{text}</p>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {values.map((value) => {
            const selected = rating === value;
            const label = legend?.[value - min];
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={label ? `Nilai ${value} — ${label}` : `Nilai ${value}`}
                onClick={() => onRate(value)}
                className={cn(
                  "flex size-12 items-center justify-center rounded-lg border text-base font-medium tabular-nums transition-colors",
                  selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {selected ? <Check className="size-4" aria-hidden /> : value}
              </button>
            );
          })}
        </div>

        {legend && (
          <div className="flex max-w-md flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {values.map((value) => (
              <span key={value}>
                <span className="font-medium tabular-nums">{value}</span> {legend[value - min]}
              </span>
            ))}
          </div>
        )}

        {ends && (
          <div className="flex max-w-md justify-between text-xs text-muted-foreground">
            <span>{ends[0]}</span>
            <span>{ends[1]}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Pilih satu angka yang paling menggambarkan diri Anda. Jawaban tersimpan otomatis.
        </p>
      </div>
    </div>
  );
}
