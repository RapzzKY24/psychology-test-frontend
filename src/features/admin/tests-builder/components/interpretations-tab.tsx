"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { coverage, getPatternCodes } from "../coverage";
import type { BuilderController } from "../hooks/use-builder-form";
import { InterpretationCodeGrid } from "./interpretation-code-grid";

export function InterpretationsTab({
  builder,
  locked,
}: {
  builder: BuilderController;
  locked: boolean;
}) {
  const { form, interpretationsArray } = builder;
  const watched = form.watch("interpretations");
  // RIGHT_WRONG_NORM uses RAW_0..RAW_n, DISC 1..40, a pair instrument derives
  // its codes from the item mappings — so the items are part of the input.
  const { scorerType } = builder;
  const watchedItems = form.watch("items") ?? [];
  const itemCount = watchedItems.length;
  const itemContents = watchedItems.map((item) => item.content);
  const patternCodes = getPatternCodes(scorerType, itemCount, itemContents, builder.scoringConfig);
  const stat = coverage(watched, scorerType, itemCount, itemContents, builder.scoringConfig);
  // "1" is the DISC default; a pair test starts on its first derived code.
  const activeCode = patternCodes.includes(builder.activePattern)
    ? builder.activePattern
    : (patternCodes[0] ?? builder.activePattern);
  const rowIndex = watched.findIndex((row) => row.patternCode === activeCode);
  const activeRow = rowIndex >= 0 ? watched[rowIndex] : undefined;
  const isMissing = builder.missingCodes.includes(activeCode);

  const createRow = (code: string) => {
    // Read the live values, not the render snapshot: two quick clicks on an
    // empty chip would otherwise append the same patternCode twice, and the
    // unique index on (testId, patternCode) would reject the save.
    const exists = form.getValues("interpretations").some((row) => row.patternCode === code);
    if (!exists) {
      interpretationsArray.append({ patternCode: code, title: "", body: "" });
    }
    builder.setActivePattern(code);
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
      <InterpretationCodeGrid
        patternCodes={patternCodes}
        rows={watched}
        activeCode={activeCode}
        missingCodes={builder.missingCodes}
        filled={stat.filled}
        total={stat.total}
        locked={locked}
        onCreate={createRow}
        onSelect={builder.setActivePattern}
      />

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Pola <span className="tabular-nums">{activeCode}</span>
            {isMissing && (
              <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                dibutuhkan untuk publish
              </span>
            )}
          </p>
        </div>

        {activeRow === undefined ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada interpretasi untuk pola {activeCode}.
            </p>
            <Button className="mt-3" disabled={locked} onClick={() => createRow(activeCode)}>
              <Plus className="size-4" aria-hidden />
              Buat interpretasi
            </Button>
          </div>
        ) : (
          <div className="max-w-2xl space-y-5">
            <Field>
              <FieldLabel htmlFor="interp-title">Judul pola</FieldLabel>
              <Input
                id="interp-title"
                value={activeRow.title}
                disabled={locked}
                placeholder="Contoh: Profil Dominance–Influence"
                onChange={(e) =>
                  form.setValue(`interpretations.${rowIndex}.title`, e.target.value, {
                    shouldDirty: true,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="interp-body">Isi interpretasi</FieldLabel>
              <Textarea
                id="interp-body"
                rows={10}
                value={activeRow.body}
                disabled={locked}
                placeholder="Narasi hasil untuk peserta dengan pola ini."
                onChange={(e) =>
                  form.setValue(`interpretations.${rowIndex}.body`, e.target.value, {
                    shouldDirty: true,
                  })
                }
              />
              <FieldDescription>
                Teks ini tampil di hasil peserta dan laporan setelah psikolog menyetujui.
              </FieldDescription>
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
