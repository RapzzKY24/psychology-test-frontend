"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RightWrongItemViewProps {
  order: number;
  question?: string | null;
  imageUrl?: string | null;
  options: string[];
  mode: "choice" | "short";
  /** Derived from the key length: one tick = radio, several = checkboxes. */
  multi: boolean;
  chosen: number[];
  text: string;
  disabled: boolean;
  onChoose: (chosen: number[]) => void;
  onText: (text: string) => void;
}

export function RightWrongItemView({
  order,
  question,
  imageUrl,
  options,
  mode,
  multi,
  chosen,
  text,
  disabled,
  onChoose,
  onText,
}: RightWrongItemViewProps) {
  const toggle = (idx: number) => {
    if (!multi) {
      onChoose([idx]);
      return;
    }
    onChoose(
      chosen.includes(idx)
        ? chosen.filter((v) => v !== idx)
        : [...chosen, idx].sort((a, b) => a - b),
    );
  };

  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Soal {order}
      </p>
      {question && <p className="whitespace-pre-wrap text-base font-medium">{question}</p>}
      {imageUrl && (
        <div className="overflow-hidden rounded-xl border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Gambar soal ${order}`}
            className="max-h-72 w-full object-contain"
          />
        </div>
      )}

      {mode === "short" ? (
        <div className="space-y-2">
          <label htmlFor="rw-answer" className="text-sm font-medium text-muted-foreground">
            Jawaban Anda
          </label>
          <Input
            id="rw-answer"
            value={text}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Tulis jawaban singkat..."
            className="h-11 text-base"
            onChange={(e) => onText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Tulis angka atau kata saja, tanpa satuan. Jawaban tersimpan otomatis.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            {options.map((opt, idx) => {
              const selected = chosen.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => toggle(idx)}
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
                  {selected && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {multi ? "Pilih semua jawaban yang benar." : "Pilih satu jawaban."} Jawaban tersimpan
            otomatis.
          </p>
        </>
      )}
    </div>
  );
}
