"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { RightWrongItemContentInput } from "../schemas";
import { ImportItemsDialog } from "./import-items-dialog";
import { RightWrongItemEditor } from "./right-wrong-item-editor";
import { RightWrongItemList } from "./right-wrong-item-list";

const EMPTY_RIGHT_WRONG = {
  content: {
    question: "",
    imageUrl: null as string | null,
    options: ["", ""],
    correctIndex: 0,
  },
};

export function RightWrongItemsTab({
  builder,
  locked,
  testId,
}: {
  builder: BuilderController;
  locked: boolean;
  testId: string;
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

  // Read the live length, not the render snapshot: two fast clicks would both
  // land on the same index and leave the second new item unselected.
  const add = () => {
    const index = builder.form.getValues("items").length;
    itemsArray.append(EMPTY_RIGHT_WRONG as never);
    builder.setActiveItem(index);
  };

  const importItems = (items: RightWrongItemContentInput[]) => {
    const start = builder.form.getValues("items").length;
    itemsArray.append(items.map((content) => ({ content })) as never);
    builder.setActiveItem(start);
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
      <RightWrongItemList
        items={watchedItems as never}
        active={active}
        locked={locked}
        onSelect={builder.setActiveItem}
        onAdd={add}
        importTrigger={
          <ImportItemsDialog onImport={importItems}>
            <Button type="button" variant="outline" size="sm" disabled={locked}>
              <Upload className="size-4" aria-hidden />
              Import
            </Button>
          </ImportItemsDialog>
        }
      />

      <div className="space-y-5 p-6">
        {watchedItems.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Belum ada item. Tambah item pertama dari panel kiri.
          </p>
        ) : (
          <RightWrongItemEditor
            builder={builder}
            active={active}
            total={watchedItems.length}
            testId={testId}
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
