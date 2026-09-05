"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DISC_DIMENSIONS } from "../constants";
import type { DiscDimension } from "../constants";
import type { BuilderController } from "../hooks/use-builder-form";
import { cn } from "@/lib/utils";

const EMPTY_ITEM = {
  content: {
    words: ["", "", "", ""],
    mostMapping: ["D", "I", "S", "C"] as DiscDimension[],
    leastMapping: ["D", "I", "S", "C"] as DiscDimension[],
  },
};

function MappingChips({
  prefix,
  wordIndex,
  value,
  onChange,
  disabled,
}: {
  prefix: string;
  wordIndex: number;
  value: DiscDimension;
  onChange: (next: DiscDimension) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label={`${prefix} kata ${wordIndex + 1}`}>
      {DISC_DIMENSIONS.map((dim) => (
        <button
          key={dim}
          type="button"
          disabled={disabled}
          aria-pressed={value === dim}
          aria-label={`${prefix} kata ${wordIndex + 1}: ${dim}`}
          onClick={() => onChange(dim)}
          className={cn(
            "size-7 rounded-md border text-xs font-medium transition-colors",
            value === dim
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          {dim}
        </button>
      ))}
    </div>
  );
}

export function ItemsTab({ builder, locked }: { builder: BuilderController; locked: boolean }) {
  const { form, itemsArray } = builder;
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const watchedItems = form.watch("items");
  const active = Math.min(builder.activeItem, Math.max(watchedItems.length - 1, 0));
  const activeContent = form.watch(`items.${active}.content`);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= watchedItems.length) return;
    itemsArray.swap(from, to);
    builder.setActiveItem(to);
  };

  const remove = () => {
    if (confirmRemove === null) return;
    itemsArray.remove(confirmRemove);
    builder.setActiveItem(Math.max(0, confirmRemove - 1));
    setConfirmRemove(null);
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
      <aside className="border-b p-4 lg:border-b-0 lg:border-r">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">
            {watchedItems.length} item <span className="text-muted-foreground">/ urutan soal</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={locked}
            onClick={() => {
              itemsArray.append(EMPTY_ITEM);
              builder.setActiveItem(watchedItems.length);
            }}
          >
            <Plus className="size-4" aria-hidden />
            Tambah
          </Button>
        </div>
        <ol className="max-h-[60vh] space-y-1 overflow-y-auto">
          {itemsArray.fields.map((field, idx) => {
            const words = watchedItems[idx]?.content.words ?? [];
            const filled = words.every((w) => w.trim().length > 0);
            return (
              <li key={field.id}>
                <button
                  type="button"
                  onClick={() => builder.setActiveItem(idx)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                    idx === active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md text-xs tabular-nums",
                      filled ? "bg-primary/15 text-primary" : "border border-dashed",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{words.filter(Boolean).join(" · ") || "(kosong)"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="space-y-5 p-6">
        {watchedItems.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Belum ada item. Tambah item pertama dari panel kiri.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Item #{active + 1}</p>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Naikkan urutan"
                  disabled={locked || active === 0}
                  onClick={() => move(active, active - 1)}
                >
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Turunkan urutan"
                  disabled={locked || active === watchedItems.length - 1}
                  onClick={() => move(active, active + 1)}
                >
                  <ArrowDown className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 text-destructive"
                  aria-label="Hapus item"
                  disabled={locked}
                  onClick={() => setConfirmRemove(active)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((wordIdx) => (
                <Field key={wordIdx}>
                  <FieldLabel htmlFor={`word-${wordIdx}`}>Kata {wordIdx + 1}</FieldLabel>
                  <Input
                    id={`word-${wordIdx}`}
                    value={activeContent?.words[wordIdx] ?? ""}
                    disabled={locked}
                    onChange={(e) =>
                      form.setValue(`items.${active}.content.words.${wordIdx}`, e.target.value, {
                        shouldDirty: true,
                      })
                    }
                  />
                </Field>
              ))}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <p className="text-sm font-medium">
                Mapping per kata <span className="text-muted-foreground">(D Dominance · I Influence · S Steadiness · C Compliance · * netral)</span>
              </p>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Most</p>
                {[0, 1, 2, 3].map((wordIdx) => (
                  <div key={wordIdx} className="flex flex-wrap items-center gap-3">
                    <span className="w-20 text-sm text-muted-foreground">Kata {wordIdx + 1}</span>
                    <MappingChips
                      prefix="Most"
                      wordIndex={wordIdx}
                      value={activeContent?.mostMapping[wordIdx] ?? "D"}
                      disabled={locked}
                      onChange={(dim) =>
                        form.setValue(`items.${active}.content.mostMapping.${wordIdx}`, dim, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Least</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={locked}
                    onClick={() =>
                      form.setValue(
                        `items.${active}.content.leastMapping`,
                        [...(activeContent?.mostMapping ?? ["D", "I", "S", "C"])],
                        { shouldDirty: true },
                      )
                    }
                  >
                    <Copy className="size-3.5" aria-hidden />
                    Samakan dengan Most
                  </Button>
                </div>
                {[0, 1, 2, 3].map((wordIdx) => (
                  <div key={wordIdx} className="flex flex-wrap items-center gap-3">
                    <span className="w-20 text-sm text-muted-foreground">Kata {wordIdx + 1}</span>
                    <MappingChips
                      prefix="Least"
                      wordIndex={wordIdx}
                      value={activeContent?.leastMapping[wordIdx] ?? "D"}
                      disabled={locked}
                      onChange={(dim) =>
                        form.setValue(`items.${active}.content.leastMapping.${wordIdx}`, dim, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <FieldDescription>
              Peserta memilih satu kata paling cocok (Most) dan satu paling tidak cocok (Least) per
              item — mapping menentukan dimensi skor tiap kata.
            </FieldDescription>
          </>
        )}

        <AlertDialog open={confirmRemove !== null} onOpenChange={(o) => !o && setConfirmRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus item #{(confirmRemove ?? 0) + 1}?</AlertDialogTitle>
              <AlertDialogDescription>
                Item dihapus dari draft — perubahan baru tersimpan saat Anda menekan Simpan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
