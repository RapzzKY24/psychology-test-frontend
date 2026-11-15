"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TimedGridItemViewProps {
  /** Printed lajur number. */
  column: number;
  /** The lajur's digits, top to bottom. */
  digits: number[];
  /** One entry per gap; `null` is a gap not filled yet. */
  answers: (number | null)[];
  disabled: boolean;
  onChange: (answers: (number | null)[]) => void;
  /** The last gap just got a digit — the runner moves on by itself. */
  onComplete: () => void;
}

/**
 * One lajur of a Pauli or Kraepelin grid: a row of digits with an answer box
 * between each pair. The participant writes the last digit of each sum, exactly
 * as on paper — the key never reaches the browser, so nothing here marks an
 * answer right or wrong while the test is running.
 *
 * Typing moves the cursor forward, Backspace walks back, and a filled row
 * reports itself so the runner can open the next lajur.
 */
export function TimedGridItemView({
  column,
  digits,
  answers,
  disabled,
  onChange,
  onComplete,
}: TimedGridItemViewProps) {
  const gaps = Math.max(digits.length - 1, 0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const focusBox = useCallback((index: number) => {
    const target = boxes.current[Math.min(Math.max(index, 0), gaps - 1)];
    target?.focus();
    target?.select();
  }, [gaps]);

  // Opening a lajur should not need a click: the first empty gap takes focus.
  useEffect(() => {
    const firstEmpty = answers.findIndex((answer) => answer === null);
    focusBox(firstEmpty === -1 ? 0 : firstEmpty);
    // Only when the lajur changes — re-focusing on every keystroke would fight
    // the cursor the participant is moving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, gaps]);

  const write = useCallback(
    (index: number, digit: number) => {
      const next = Array.from({ length: gaps }, (_, slot) =>
        slot === index ? digit : (answers[slot] ?? null),
      );
      onChange(next);
      const firstEmpty = next.findIndex((answer) => answer === null);
      if (firstEmpty === -1) onComplete();
      else focusBox(firstEmpty);
    },
    [answers, focusBox, gaps, onChange, onComplete],
  );

  const clear = useCallback(
    (index: number) => {
      const next = Array.from({ length: gaps }, (_, slot) =>
        slot === index ? null : (answers[slot] ?? null),
      );
      onChange(next);
    },
    [answers, gaps, onChange],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Lajur {column}
        </p>
        <p className="text-xs text-muted-foreground">
          {answers.filter((answer) => answer !== null).length} / {gaps} terisi
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Tulis angka terakhir dari penjumlahan dua angka yang bersebelahan, dari
        atas ke bawah.
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1.5">
          {digits.map((digit, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-base font-medium tabular-nums">
                {digit}
              </span>
              {index < gaps ? (
                <input
                  ref={(element) => {
                    boxes.current[index] = element;
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={`Jawaban antara ${digit} dan ${digits[index + 1]}`}
                  maxLength={1}
                  disabled={disabled}
                  value={answers[index] ?? ""}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/\D/g, "");
                    if (!raw) {
                      clear(index);
                      return;
                    }
                    write(index, Number(raw.at(-1)));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && answers[index] === null) {
                      event.preventDefault();
                      focusBox(index - 1);
                    }
                  }}
                  onFocus={(event) => event.currentTarget.select()}
                  className={cn(
                    "h-10 w-12 rounded-lg border bg-card text-center text-base font-medium tabular-nums outline-none transition-colors",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    answers[index] === null ? "" : "border-primary/60 bg-primary/5",
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Lajur yang sudah selesai tidak bisa dibuka lagi. Jawaban tersimpan
        otomatis.
      </p>
    </div>
  );
}
