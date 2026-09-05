"use client";

import { Check } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { DiscResponse } from "../schemas";

interface DiscItemViewProps {
  order: number;
  words: string[];
  value: DiscResponse | undefined;
  duplicateWarning: string | null;
  disabled: boolean;
  onSelect: (part: "most" | "least", wordIndex: number) => void;
}

function WordRow({
  part,
  label,
  words,
  value,
  disabled,
  onSelect,
}: {
  part: "most" | "least";
  label: string;
  words: string[];
  value: number;
  disabled: boolean;
  onSelect: (part: "most" | "least", wordIndex: number) => void;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {words.map((word, idx) => {
          const selected = value === idx;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onSelect(part, idx)}
              className={cn(
                "flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors",
                selected
                  ? "border-primary bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {word}
              {selected && <Check className="ml-1.5 size-3.5 text-primary" aria-hidden />}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

/**
 * One DISC forced-choice item: the four words plus a Most and a Least row.
 * The backend rejects most === least; the runner blocks it client-side too.
 */
export function DiscItemView({
  order,
  words,
  value,
  duplicateWarning,
  disabled,
  onSelect,
}: DiscItemViewProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Soal {order}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {words.map((word, idx) => (
          <div
            key={idx}
            className="flex min-h-20 items-center justify-center rounded-xl border bg-card p-4 text-center text-base font-medium"
          >
            {word}
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <WordRow
          part="most"
          label="Paling sesuai dengan saya (Most)"
          words={words}
          value={value?.most ?? -1}
          disabled={disabled}
          onSelect={onSelect}
        />
        <WordRow
          part="least"
          label="Paling tidak sesuai dengan saya (Least)"
          words={words}
          value={value?.least ?? -1}
          disabled={disabled}
          onSelect={onSelect}
        />
      </div>
      {duplicateWarning && (
        <p role="alert" className="text-sm text-destructive">
          {duplicateWarning}
        </p>
      )}
    </div>
  );
}
