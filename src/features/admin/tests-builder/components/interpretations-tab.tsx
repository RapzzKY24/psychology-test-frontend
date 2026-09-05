"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PATTERN_CODES } from "../constants";
import { coverage, isFilled } from "../coverage";
import type { BuilderController } from "../hooks/use-builder-form";
import { cn } from "@/lib/utils";

export function InterpretationsTab({
  builder,
  locked,
}: {
  builder: BuilderController;
  locked: boolean;
}) {
  const { form, interpretationsArray } = builder;
  const watched = form.watch("interpretations");
  const stat = coverage(watched);
  const rowIndex = watched.findIndex((row) => row.patternCode === builder.activePattern);
  const activeRow = rowIndex >= 0 ? watched[rowIndex] : undefined;
  const isMissing = builder.missingCodes.includes(builder.activePattern);

  const createRow = (code: string) => {
    interpretationsArray.append({ patternCode: code, title: "", body: "" });
    builder.setActivePattern(code);
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
      <aside className="border-b p-4 lg:border-b-0 lg:border-r">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">
            {stat.filled} dari {stat.total} lengkap
          </p>
          {stat.missing > 0 && (
            <span className="rounded-full bg-chart-3/20 px-2 py-0.5 text-xs font-medium text-foreground tabular-nums">
              {stat.missing} belum
            </span>
          )}
        </div>
        <div className="grid max-h-[60vh] grid-cols-8 gap-1.5 overflow-y-auto pb-1">
          {PATTERN_CODES.map((code) => {
            const row = watched.find((r) => r.patternCode === code);
            const filled = row !== undefined && isFilled(row);
            const highlighted = builder.missingCodes.includes(code);
            const active = code === builder.activePattern;
            return (
              <button
                key={code}
                type="button"
                onClick={() => builder.setActivePattern(code)}
                aria-pressed={active}
                aria-label={`Pola ${code}${filled ? " (terisi)" : " (kosong)"}`}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
                  filled && "border-transparent bg-primary/15 text-primary",
                  !filled && "border-dashed text-muted-foreground hover:text-foreground",
                  highlighted && "border-destructive text-destructive",
                  active && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
              >
                {code}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {builder.missingCodes.length > 0
            ? "Chip merah = pola yang membuat publish ditolak backend."
            : "Chip biru = interpretasi lengkap; garis putus-putus = belum diisi."}
        </p>
      </aside>

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Pola <span className="tabular-nums">{builder.activePattern}</span>
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
              Belum ada interpretasi untuk pola {builder.activePattern}.
            </p>
            <Button className="mt-3" disabled={locked} onClick={() => createRow(builder.activePattern)}>
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
