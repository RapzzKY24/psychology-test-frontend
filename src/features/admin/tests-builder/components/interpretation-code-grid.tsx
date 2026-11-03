"use client";

import { cn } from "@/lib/utils";
import { isFilled, type InterpretationDraft } from "../coverage";

interface InterpretationCodeGridProps {
  patternCodes: readonly string[];
  rows: InterpretationDraft[];
  activeCode: string;
  /** Codes the backend will reject on publish until a row exists. */
  missingCodes: string[];
  filled: number;
  total: number;
  locked: boolean;
  /** A chip without a row creates one on click; otherwise it just selects. */
  onCreate: (code: string) => void;
  onSelect: (code: string) => void;
}

/** Left rail of the interpretations tab: one chip per pattern code. */
export function InterpretationCodeGrid({
  patternCodes,
  rows,
  activeCode,
  missingCodes,
  filled,
  total,
  locked,
  onCreate,
  onSelect,
}: InterpretationCodeGridProps) {
  const missing = total - filled;

  return (
    <aside className="border-b p-4 lg:border-b-0 lg:border-r">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">
          {filled} dari {total} lengkap
        </p>
        {missing > 0 && (
          <span className="rounded-full bg-chart-3/20 px-2 py-0.5 text-xs font-medium text-foreground tabular-nums">
            {missing} belum
          </span>
        )}
      </div>
      <div className="grid max-h-[60vh] grid-cols-8 gap-1.5 overflow-y-auto pb-1">
        {patternCodes.map((code) => {
          const row = rows.find((r) => r.patternCode === code);
          const isComplete = row !== undefined && isFilled(row);
          const highlighted = missingCodes.includes(code);
          const active = code === activeCode;
          return (
            <button
              key={code}
              type="button"
              title={code}
              onClick={() => (row === undefined && !locked ? onCreate(code) : onSelect(code))}
              aria-pressed={active}
              aria-label={`Pola ${code}${isComplete ? " (terisi)" : " (kosong)"}`}
              className={cn(
                "flex h-9 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
                isComplete && "border-transparent bg-primary/15 text-primary",
                !isComplete && "border-dashed text-muted-foreground hover:text-foreground",
                highlighted && "border-destructive text-destructive",
                active && "ring-2 ring-primary ring-offset-1 ring-offset-background",
              )}
            >
              {/* RIGHT_WRONG_NORM: tampilkan hanya indeks angka biar gak overflow (kode lengkap di tooltip/aria). */}
              {code.replace(/^RAW_/, "")}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {missingCodes.length > 0
          ? "Chip merah = pola yang membuat publish ditolak backend."
          : "Chip biru = interpretasi lengkap; garis putus-putus = belum diisi."}
      </p>
    </aside>
  );
}
