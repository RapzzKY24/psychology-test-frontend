"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemImageUpload } from "./item-image-upload";

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
  const { form, itemsArray } = builder;
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const watchedItems = form.watch("items");
  const active = Math.min(builder.activeItem, Math.max(watchedItems.length - 1, 0));
  const activeContent = form.watch(`items.${active}.content`) as unknown as
    | {
        question?: string;
        imageUrl?: string | null;
        options?: string[];
        correctIndex?: number;
      }
    | undefined;

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

  const updateOption = (idx: number, value: string) => {
    const opts = [...(activeContent?.options ?? ["", ""])];
    opts[idx] = value;
    form.setValue(`items.${active}.content.options`, opts as never, { shouldDirty: true });
  };

  const addOption = () => {
    const opts = [...(activeContent?.options ?? [])];
    if (opts.length >= 6) return;
    opts.push("");
    form.setValue(`items.${active}.content.options`, opts as never, { shouldDirty: true });
  };

  const removeOption = (idx: number) => {
    const opts = [...(activeContent?.options ?? [])];
    if (opts.length <= 2) return;
    opts.splice(idx, 1);
    let correct = activeContent?.correctIndex ?? 0;
    if (correct >= opts.length) correct = opts.length - 1;
    form.setValue(`items.${active}.content.options`, opts as never, { shouldDirty: true });
    form.setValue(`items.${active}.content.correctIndex`, correct as never, { shouldDirty: true });
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
              itemsArray.append(EMPTY_RIGHT_WRONG as never);
              builder.setActiveItem(watchedItems.length);
            }}
          >
            <Plus className="size-4" aria-hidden />
            Tambah
          </Button>
        </div>
        <ol className="max-h-[60vh] space-y-1 overflow-y-auto">
          {itemsArray.fields.map((field, idx) => {
            const c = watchedItems[idx]?.content as unknown as
              { question?: string; options?: string[] } | undefined;
            const label = c?.question?.trim() || c?.options?.[0]?.trim() || "(kosong)";
            const filled = Boolean(
              c?.question?.trim() || (c?.options && c.options.every((o) => o.trim())),
            );
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
                  <span className="truncate">{label}</span>
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

            <Field>
              <FieldLabel htmlFor="rw-question">Pertanyaan (opsional jika ada gambar)</FieldLabel>
              <Textarea
                id="rw-question"
                value={activeContent?.question ?? ""}
                disabled={locked}
                rows={3}
                placeholder="Tulis pertanyaan..."
                onChange={(e) =>
                  form.setValue(`items.${active}.content.question`, e.target.value as never, {
                    shouldDirty: true,
                  })
                }
              />
            </Field>

            <ItemImageUpload
              testId={testId}
              value={activeContent?.imageUrl ?? null}
              onChange={(url) =>
                form.setValue(`items.${active}.content.imageUrl`, url as never, {
                  shouldDirty: true,
                })
              }
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Pilihan jawaban (2–6)</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={locked || (activeContent?.options?.length ?? 0) >= 6}
                  onClick={addOption}
                >
                  <Plus className="size-4" /> Tambah opsi
                </Button>
              </div>
              {(activeContent?.options ?? ["", ""]).map((opt, idx) => (
                <Field
                  key={idx}
                  data-invalid={
                    (
                      form.formState.errors.items?.[active]?.content as unknown as {
                        options?: unknown[];
                      }
                    )?.options?.[idx]
                      ? true
                      : undefined
                  }
                >
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${active}`}
                        checked={(activeContent?.correctIndex ?? 0) === idx}
                        disabled={locked}
                        onChange={() =>
                          form.setValue(`items.${active}.content.correctIndex`, idx as never, {
                            shouldDirty: true,
                          })
                        }
                        className="size-4"
                        aria-label={`Kunci opsi ${idx + 1}`}
                      />
                      <span className="text-sm tabular-nums">{String.fromCharCode(65 + idx)}.</span>
                    </div>
                    <Input
                      value={opt}
                      disabled={locked}
                      placeholder={`Opsi ${idx + 1}`}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="h-10 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-10 shrink-0"
                      disabled={locked || (activeContent?.options?.length ?? 0) <= 2}
                      onClick={() => removeOption(idx)}
                      aria-label={`Hapus opsi ${idx + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  {Boolean(
                    (
                      form.formState.errors.items?.[active]?.content as unknown as {
                        options?: unknown[];
                      }
                    )?.options?.[idx],
                  ) && (
                    <FieldError
                      errors={[
                        (
                          form.formState.errors.items?.[active]?.content as unknown as {
                            options?: { message?: string }[];
                          }
                        )?.options?.[idx] as never,
                      ]}
                    />
                  )}
                </Field>
              ))}
              <p className="text-xs text-muted-foreground">
                Pilih radio untuk kunci jawaban. Minimal 2 opsi, maksimal 6.
              </p>
            </div>

            {form.formState.errors.items?.[active]?.content && (
              <p className="text-sm text-destructive">
                {(form.formState.errors.items[active]?.content as unknown as { message?: string })
                  ?.message ?? "Periksa field yang bertanda merah."}
              </p>
            )}
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
