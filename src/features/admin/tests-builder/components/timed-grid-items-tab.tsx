"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { parseTimedGridLines, timedGridLines } from "../schemas";

/**
 * A timed sheet runs from 50 lajur of 26 gaps (Kraepelin) to 80 lajur of 50
 * (Pauli). Typing that into a per-item editor would be thousands of boxes, so
 * the tab works the way the source does: paste the whole sheet, one lajur per
 * line, and the tab turns each line into one item.
 */
export function TimedGridItemsTab({
  builder,
  locked,
}: {
  builder: BuilderController;
  locked: boolean;
}) {
  const { itemsArray } = builder;
  const watchedItems = builder.form.watch("items");
  const [text, setText] = useState(() => timedGridLines(watchedItems as never));

  const parsed = useMemo(() => parseTimedGridLines(text), [text]);
  const gaps = parsed.items.reduce((sum, item) => sum + item.digits.length - 1, 0);
  const dirty = text !== timedGridLines(watchedItems as never);

  const apply = () => {
    if (parsed.items.length === 0) return;
    itemsArray.replace(parsed.items.map((content) => ({ content })) as never);
    builder.setActiveItem(0);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">Deret angka per lajur</p>
        <p className="text-sm text-muted-foreground">
          Tempel satu lajur per baris — angka saja, urut dari atas ke bawah. Baris
          pertama menjadi lajur 1. Kunci jawaban dihitung otomatis di server, jadi
          tidak perlu diisi.
        </p>
      </div>

      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={locked}
        rows={18}
        spellCheck={false}
        className="font-mono text-sm leading-6"
        placeholder={"2728548747333\n2827081843568\n…"}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={apply}
          disabled={locked || !dirty || parsed.items.length === 0}
        >
          Terapkan {parsed.items.length} lajur
        </Button>
        <p className="text-xs text-muted-foreground">
          {parsed.items.length} lajur · {gaps} kotak jawaban
          {watchedItems.length > 0 && dirty
            ? ` · mengganti ${watchedItems.length} lajur yang tersimpan`
            : ""}
        </p>
      </div>

      {parsed.errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <ul className="space-y-1">
            {parsed.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {parsed.items.length > 0 && (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[64px_1fr_88px] gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Lajur</span>
            <span>Angka</span>
            <span className="text-right">Kotak</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {parsed.items.map((item) => (
              <div
                key={item.column}
                className="grid grid-cols-[64px_1fr_88px] gap-2 border-b px-3 py-2 text-xs last:border-b-0"
              >
                <span className="tabular-nums">{item.column}</span>
                <span className="truncate font-mono">{item.digits.join(" ")}</span>
                <span className="text-right tabular-nums">{item.digits.length - 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
