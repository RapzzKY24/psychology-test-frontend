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
import type { BuilderController } from "../hooks/use-builder-form";
import { RankGroupItemEditor } from "./rank-group-item-editor";
import { RankGroupItemList } from "./rank-group-item-list";

const EMPTY_GROUP = {
  content: {
    question: "",
    options: ["", ""],
    mapping: ["", ""],
  },
};

export function RankGroupItemsTab({
  builder,
  locked,
}: {
  builder: BuilderController;
  locked: boolean;
}) {
  const { itemsArray } = builder;
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const watchedItems = builder.form.watch("items");
  const active = Math.min(builder.activeItem, Math.max(watchedItems.length - 1, 0));

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

  // Live length, not the render snapshot — see RightWrongItemsTab.
  const add = () => {
    const index = builder.form.getValues("items").length;
    itemsArray.append(EMPTY_GROUP as never);
    builder.setActiveItem(index);
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
      <RankGroupItemList
        items={watchedItems as never}
        active={active}
        locked={locked}
        onSelect={builder.setActiveItem}
        onAdd={add}
      />

      <div className="space-y-5 p-6">
        {watchedItems.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Belum ada kelompok. Tambah kelompok pertama dari panel kiri.
          </p>
        ) : (
          <RankGroupItemEditor
            builder={builder}
            active={active}
            total={watchedItems.length}
            locked={locked}
            onMove={move}
            onRemove={() => setConfirmRemove(active)}
            onDuplicate={duplicate}
          />
        )}

        <AlertDialog
          open={confirmRemove !== null}
          onOpenChange={(o) => !o && setConfirmRemove(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus kelompok #{(confirmRemove ?? 0) + 1}?</AlertDialogTitle>
              <AlertDialogDescription>
                Kelompok dihapus dari draft — perubahan baru tersimpan saat Anda menekan Simpan.
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
