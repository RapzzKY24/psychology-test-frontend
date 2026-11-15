"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface MarkGroupItemEditorProps {
  builder: BuilderController;
  active: number;
  total: number;
  locked: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

type ItemDraft = {
  question?: string;
  options?: string[];
  mapping?: string[][];
  verification?: number[];
};

const MAX_OPTIONS = 42;
const MIN_OPTIONS = 2;

/** "out, me" -> ["OUT", "ME"]; anything that is not a field code is dropped. */
function parseFields(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map((code) => code.replace(/[^a-zA-Z.]/g, "").toUpperCase().slice(0, 6))
    .filter(Boolean);
}

/**
 * Right pane: one list of activities. Each row carries the fields it scores
 * (Kuder loads an activity on two or three, some on none) and a validity tick
 * for the rows the instrument's verification scale counts.
 */
export function MarkGroupItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: MarkGroupItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const options = content?.options ?? ["", ""];
  const mapping = content?.mapping ?? options.map(() => []);
  const verification = content?.verification ?? [];

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | {
        question?: { message?: string };
        options?: { message?: string };
        mapping?: { message?: string };
        verification?: { message?: string };
      }
    | undefined;

  const write = (nextOptions: string[], nextMapping: string[][], nextVerification: number[]) => {
    form.setValue(`items.${active}.content.options`, nextOptions as never, {
      shouldDirty: true,
    });
    form.setValue(`items.${active}.content.mapping`, nextMapping as never, {
      shouldDirty: true,
    });
    // Flags on rows that no longer exist would fail the schema on save.
    const live = nextVerification.filter((index) => index < nextOptions.length);
    form.setValue(`items.${active}.content.verification`, (live.length ? live : undefined) as never, {
      shouldDirty: true,
    });
  };

  const setOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    write(next, mapping, verification);
  };

  const setFields = (index: number, value: string) => {
    const next = options.map((_, i) => mapping[i] ?? []);
    next[index] = parseFields(value);
    write(options, next, verification);
  };

  const toggleVerification = (index: number, checked: boolean) => {
    const next = checked
      ? [...verification, index].sort((a, b) => a - b)
      : verification.filter((value) => value !== index);
    write(options, mapping, next);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    write([...options, ""], [...mapping, []], verification);
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    write(
      options.filter((_, i) => i !== index),
      options.map((_, i) => mapping[i] ?? []).filter((_, i) => i !== index),
      // Everything after the removed row shifts up by one.
      verification
        .filter((value) => value !== index)
        .map((value) => (value > index ? value - 1 : value)),
    );
  };

  return (
    <>
      <ItemToolbar
        index={active}
        total={total}
        locked={locked}
        onMove={onMove}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
      />

      <Field data-invalid={contentErrors?.question ? true : undefined}>
        <FieldLabel htmlFor="mark-group-question">Nama kelompok</FieldLabel>
        <Input
          id="mark-group-question"
          value={content?.question ?? ""}
          disabled={locked}
          maxLength={2000}
          placeholder="Contoh: Kelompok 1"
          aria-invalid={contentErrors?.question ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.question`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {contentErrors?.question && <FieldError errors={[contentErrors.question]} />}
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Daftar aktivitas</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={locked || options.length >= MAX_OPTIONS}
            onClick={addOption}
          >
            <Plus className="size-4" aria-hidden />
            Tambah baris
          </Button>
        </div>

        <div className="hidden gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[1.5rem_1fr_7rem_2.5rem_2.25rem]">
          <span>#</span>
          <span>Aktivitas</span>
          <span>Bidang</span>
          <span>V</span>
          <span className="sr-only">Aksi</span>
        </div>

        {options.map((option, index) => (
          <div
            key={index}
            className="grid items-start gap-2 sm:grid-cols-[1.5rem_1fr_7rem_2.5rem_2.25rem]"
          >
            <span className="pt-2 text-sm tabular-nums text-muted-foreground">{index + 1}.</span>
            <Input
              value={option}
              disabled={locked}
              maxLength={200}
              placeholder={`Aktivitas ${index + 1}`}
              aria-label={`Aktivitas ${index + 1}`}
              onChange={(e) => setOption(index, e.target.value)}
            />
            <Input
              className="font-mono uppercase"
              value={(mapping[index] ?? []).join(",")}
              disabled={locked}
              placeholder="OUT,ME"
              aria-label={`Bidang aktivitas ${index + 1}`}
              onChange={(e) => setFields(index, e.target.value)}
            />
            <span className="flex h-9 items-center justify-center">
              <Checkbox
                checked={verification.includes(index)}
                disabled={locked}
                aria-label={`Aktivitas ${index + 1} masuk skala validitas`}
                onCheckedChange={(checked) => toggleVerification(index, checked === true)}
              />
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={locked || options.length <= MIN_OPTIONS}
              aria-label={`Hapus baris ${index + 1}`}
              onClick={() => removeOption(index)}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        ))}

        {contentErrors?.options && <FieldError errors={[contentErrors.options]} />}
        {contentErrors?.mapping && <FieldError errors={[contentErrors.mapping]} />}
        {contentErrors?.verification && <FieldError errors={[contentErrors.verification]} />}
      </div>

      <FieldDescription>
        Peserta menandai tiap aktivitas dengan + (suka) atau − (tidak suka). Kolom bidang berisi
        satu atau beberapa kode dipisah koma dan tidak pernah dikirim ke peserta; satu
        interpretasi wajib ada untuk tiap bidang yang dipakai. Centang V untuk baris yang dihitung
        skala validitas.
      </FieldDescription>
    </>
  );
}
