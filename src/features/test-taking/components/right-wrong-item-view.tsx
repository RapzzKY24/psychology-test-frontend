"use client";

import { cn } from "@/lib/utils";

interface RightWrongItemViewProps {
  order: number;
  question?: string | null;
  imageUrl?: string | null;
  options: string[];
  value: number | undefined;
  disabled: boolean;
  onSelect: (chosen: number) => void;
}

export function RightWrongItemView({
  order,
  question,
  imageUrl,
  options,
  value,
  disabled,
  onSelect,
}: RightWrongItemViewProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Soal {order}</p>
      {question && <p className="text-base font-medium">{question}</p>}
      {imageUrl && (
        <div className="overflow-hidden rounded-xl border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={`Gambar soal ${order}`} className="max-h-64 w-full object-contain" />
        </div>
      )}
      <div className="grid gap-2">
        {options.map((opt, idx) => {
          const selected = value === idx;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onSelect(idx)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selected
                  ? "border-primary bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-medium tabular-nums">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Pilih satu jawaban. Jawaban tersimpan otomatis.</p>
    </div>
  );
}
