"use client";

import { useState } from "react";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { DiscDimension } from "../constants";
import type { BuilderController } from "../hooks/use-builder-form";
import { DiscItemList } from "./disc-item-list";
import { DiscMappingGrid } from "./disc-mapping-grid";
import { ItemToolbar } from "./item-toolbar";

const EMPTY_ITEM = {
  content: {
    words: ["", "", "", ""],
    mostMapping: ["D", "I", "S", "C"] as DiscDimension[],
    leastMapping: ["D", "I", "S", "C"] as DiscDimension[],
  },
};

const WORD_INDEXES = [0, 1, 2, 3];

export function ItemsTab({ builder, locked }: { builder: BuilderController; locked: boolean }) {
  const { form, itemsArray } = builder;
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const watchedItems = form.watch("items");
  const active = Math.min(builder.activeItem, Math.max(watchedItems.length - 1, 0));
  const content = form.watch(`items.${active}.content`) as unknown as
    { words?: string[]; mostMapping?: DiscDimension[]; leastMapping?: DiscDimension[] } | undefined;

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

  const add = () => {
    itemsArray.append(EMPTY_ITEM);
    builder.setActiveItem(watchedItems.length);
  };

  const duplicate = () => {
    const source = watchedItems[active];
    if (!source) return;
    // Drop the field-array key: reusing it would give two rows the same id.
    const copy = structuredClone(source) as { id?: string };
    delete copy.id;
    itemsArray.insert(active + 1, copy as never);
    builder.setActiveItem(active + 1);
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
      <DiscItemList
        items={watchedItems as never}
        active={active}
        locked={locked}
        onSelect={builder.setActiveItem}
        onAdd={add}
      />

      <div className="space-y-5 p-6">
        {watchedItems.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Belum ada item. Tambah item pertama dari panel kiri.
          </p>
        ) : (
          <>
            <ItemToolbar
              index={active}
              total={watchedItems.length}
              locked={locked}
              onMove={move}
              onRemove={() => setConfirmRemove(active)}
              onDuplicate={duplicate}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {WORD_INDEXES.map((wordIdx) => (
                <Field key={wordIdx}>
                  <FieldLabel htmlFor={`word-${wordIdx}`}>Kata {wordIdx + 1}</FieldLabel>
                  <Input
                    id={`word-${wordIdx}`}
                    value={content?.words?.[wordIdx] ?? ""}
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

            <DiscMappingGrid
              builder={builder}
              active={active}
              mostMapping={content?.mostMapping ?? ["D", "I", "S", "C"]}
              leastMapping={content?.leastMapping ?? ["D", "I", "S", "C"]}
              locked={locked}
            />

            <FieldDescription>
              Peserta memilih satu kata paling cocok (Most) dan satu paling tidak cocok (Least) per
              item — mapping menentukan dimensi skor tiap kata.
            </FieldDescription>
          </>
        )}

        <AlertDialog
          open={confirmRemove !== null}
          onOpenChange={(o) => !o && setConfirmRemove(null)}
        >
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
