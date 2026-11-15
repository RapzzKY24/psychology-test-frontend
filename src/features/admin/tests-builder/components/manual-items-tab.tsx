"use client";

import { AlertCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MANUAL_MARKS } from "@/lib/api/types";
import type { ManualMark } from "@/lib/api/types";
import { MANUAL_BOX_COUNT, MANUAL_MARK_LABELS } from "@/lib/manual-marks";
import type { BuilderController } from "../hooks/use-builder-form";
import { manualSheet } from "../schemas";

/**
 * A drawing sheet is fixed: eight boxes, each with the mark printed in it. The
 * admin never writes a stem or an answer key, so the tab only confirms the
 * sheet and lets the mark of a box be corrected if a source differs.
 */
export function ManualItemsTab({
  builder,
  locked,
}: {
  builder: BuilderController;
  locked: boolean;
}) {
  const { itemsArray } = builder;
  const items = builder.form.watch("items") as Array<{ content: { box?: number; mark?: ManualMark } }>;
  const complete = items.length === MANUAL_BOX_COUNT;

  const fill = () => {
    itemsArray.replace(manualSheet().map((content) => ({ content })) as never);
    builder.setActiveItem(0);
  };

  const setMark = (index: number, mark: ManualMark) => {
    const box = typeof items[index]?.content.box === "number" ? items[index].content.box : index + 1;
    itemsArray.update(index, { content: { box, mark } } as never);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">Lembar gambar</p>
        <p className="text-sm text-muted-foreground">
          Tiap kotak berisi satu goresan cetak yang dilengkapi peserta menjadi satu gambar.
          Tidak ada kunci jawaban dan tidak ada skor otomatis — hasilnya dibaca psikolog.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={fill} disabled={locked}>
          <LayoutGrid className="size-4" aria-hidden />
          {complete ? "Susun ulang kotak standar" : `Isi ${MANUAL_BOX_COUNT} kotak standar`}
        </Button>
        <p className="text-xs text-muted-foreground">
          {items.length} kotak tersimpan
        </p>
      </div>

      {!complete && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <p>
            Lembar harus berisi tepat {MANUAL_BOX_COUNT} kotak sebelum bisa dipublish. Tekan
            tombol di atas untuk menyusun kotak standar.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[80px_1fr] gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Kotak</span>
            <span>Goresan cetak</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.map((item, index) => {
              const box = typeof item.content.box === "number" ? item.content.box : index + 1;
              return (
                <div
                  key={`${box}-${index}`}
                  className="grid grid-cols-[80px_1fr] items-center gap-2 border-b px-3 py-2 last:border-b-0"
                >
                  <span className="text-sm tabular-nums">{box}</span>
                  <Select
                    value={item.content.mark}
                    onValueChange={(mark) => setMark(index, mark as ManualMark)}
                    disabled={locked}
                  >
                    <SelectTrigger size="sm" aria-label={`Goresan kotak ${box}`}>
                      <SelectValue placeholder="Pilih goresan" />
                    </SelectTrigger>
                    <SelectContent>
                      {MANUAL_MARKS.map((mark) => (
                        <SelectItem key={mark} value={mark}>
                          {MANUAL_MARK_LABELS[mark]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
