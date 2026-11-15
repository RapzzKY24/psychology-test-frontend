"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { optionLetter } from "@/lib/format/option-labels";

interface MultiSubtestItemViewProps {
  order: number;
  content: Record<string, unknown>;
  answer: string;
  disabled: boolean;
  /** A crossed letter — complete on its own, so the runner may move on. */
  onChoose: (letter: string) => void;
  /** A typed word or number — only complete when the participant moves on. */
  onType: (answer: string) => void;
}

/**
 * One item of a battery, drawn the way the booklet prints it. The four shapes
 * are the four kinds the family stores: five options under a sentence, a
 * composed figure, two words asking for their common concept, and a number
 * (with or without a printed series).
 */
export function MultiSubtestItemView({
  order,
  content,
  answer,
  disabled,
  onChoose,
  onType,
}: MultiSubtestItemViewProps) {
  const kind = typeof content.kind === "string" ? content.kind : "";

  if (kind === "IMAGE") {
    return (
      <div className="space-y-5">
        <ItemNumber order={order} />
        <div className="overflow-hidden rounded-xl border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={String(content.imageUrl ?? "")}
            alt={`Gambar soal ${order}`}
            className="mx-auto max-h-[26rem] w-full object-contain"
          />
        </div>
        <LetterPicker
          value={answer}
          disabled={disabled}
          onChoose={onChoose}
          hint="Pilih huruf jawaban yang benar."
        />
      </div>
    );
  }

  if (kind === "PAIR") {
    const words = Array.isArray(content.words) ? (content.words as string[]) : [];
    return (
      <div className="space-y-5">
        <ItemNumber order={order} />
        <p className="text-sm text-muted-foreground">
          Dua kata berikut termasuk dalam satu pengertian. Tulis satu kata yang mencakup keduanya.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
          {words.map((word, index) => (
            <span
              key={index}
              className="rounded-lg border bg-primary/5 px-6 py-3 text-lg font-medium"
            >
              {word}
            </span>
          ))}
        </div>
        <TextAnswer
          value={answer}
          disabled={disabled}
          placeholder="Tulis satu kata…"
          hint="Tulis satu kata saja — jawaban disimpan otomatis."
          onType={onType}
        />
      </div>
    );
  }

  if (kind === "NUMBER") {
    const series = Array.isArray(content.series) ? (content.series as number[]) : [];
    return (
      <div className="space-y-5">
        <ItemNumber order={order} />
        {typeof content.prompt === "string" && content.prompt && (
          <p className="whitespace-pre-wrap text-base font-medium">{content.prompt}</p>
        )}
        {series.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-primary/5 p-4">
            {series.map((number, index) => (
              <span key={index} className="tabular-nums text-base font-medium">
                {number}
                {index < series.length - 1 && (
                  <span className="ml-2 text-muted-foreground">·</span>
                )}
              </span>
            ))}
            <span className="tabular-nums text-base text-muted-foreground">…</span>
          </div>
        )}
        <TextAnswer
          value={answer}
          disabled={disabled}
          placeholder="Tulis angkanya…"
          hint="Tulis angka saja, tanpa satuan. Jawaban disimpan otomatis."
          numeric
          onType={onType}
        />
      </div>
    );
  }

  // CHOICE — the default shape: a sentence missing a word and five options.
  const options = (content.options ?? {}) as Record<string, string>;
  const letters = Object.keys(options).sort();
  const picked = answer.trim().toLowerCase();

  return (
    <div className="space-y-5">
      <ItemNumber order={order} />
      {typeof content.prompt === "string" && content.prompt && (
        <p className="whitespace-pre-wrap text-base font-medium">{content.prompt}</p>
      )}
      <div className="grid gap-2">
        {letters.map((letter, index) => {
          const selected = picked === letter;
          return (
            <button
              key={letter}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChoose(letter)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selected
                  ? "border-primary bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-medium">
                {optionLetter(index)}
              </span>
              <span className="flex-1">{options[letter]}</span>
              {selected && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Pilih satu jawaban. Jawaban tersimpan otomatis.
      </p>
    </div>
  );
}

function ItemNumber({ order }: { order: number }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      Soal {order}
    </p>
  );
}

/** The figure subtests print five letters and nothing else to read. */
function LetterPicker({
  value,
  disabled,
  onChoose,
  hint,
}: {
  value: string;
  disabled: boolean;
  onChoose: (letter: string) => void;
  hint: string;
}) {
  const picked = value.trim().toLowerCase();
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {["a", "b", "c", "d", "e"].map((letter) => {
          const selected = picked === letter;
          return (
            <button
              key={letter}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChoose(letter)}
              className={cn(
                "flex size-12 items-center justify-center rounded-lg border text-sm font-medium uppercase transition-colors",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{hint} Jawaban tersimpan otomatis.</p>
    </div>
  );
}

function TextAnswer({
  value,
  disabled,
  placeholder,
  hint,
  numeric = false,
  onType,
}: {
  value: string;
  disabled: boolean;
  placeholder: string;
  hint: string;
  numeric?: boolean;
  onType: (answer: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="subtest-answer" className="text-sm font-medium text-muted-foreground">
        Jawaban Anda
      </label>
      <Input
        id="subtest-answer"
        value={value}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode={numeric ? "numeric" : "text"}
        placeholder={placeholder}
        className="h-11 text-base"
        onChange={(event) => onType(event.target.value)}
      />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
