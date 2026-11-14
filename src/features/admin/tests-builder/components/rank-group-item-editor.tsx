"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface RankGroupItemEditorProps {
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
  femaleOptions?: string[];
  mapping?: string[];
};

const MAX_OPTIONS = 12;
const MIN_OPTIONS = 2;

/**
 * Right pane: one group of occupations. The female column is optional — RMIB
 * prints it, but a group whose wording does not depend on sex leaves it empty
 * and the participant sees the first list either way.
 */
export function RankGroupItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: RankGroupItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const options = content?.options ?? ["", ""];
  const female = content?.femaleOptions ?? options.map(() => "");
  const mapping = content?.mapping ?? options.map(() => "");

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | {
        question?: { message?: string };
        options?: { message?: string };
        femaleOptions?: { message?: string };
        mapping?: { message?: string };
      }
    | undefined;

  const write = (nextOptions: string[], nextFemale: string[], nextMapping: string[]) => {
    form.setValue(`items.${active}.content.options`, nextOptions as never, {
      shouldDirty: true,
    });
    form.setValue(`items.${active}.content.mapping`, nextMapping as never, {
      shouldDirty: true,
    });
    // An all-blank female column is not a list — sending it would make every
    // row invalid, so the key is dropped instead.
    form.setValue(
      `items.${active}.content.femaleOptions`,
      (nextFemale.some((option) => option.trim().length > 0) ? nextFemale : undefined) as never,
      { shouldDirty: true },
    );
  };

  const setOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    write(next, female, mapping);
  };

  const setFemale = (index: number, value: string) => {
    const next = options.map((_, i) => female[i] ?? "");
    next[index] = value;
    write(options, next, mapping);
  };

  const setField = (index: number, value: string) => {
    const next = [...mapping];
    next[index] = value
      .replace(/[^a-zA-Z.]/g, "")
      .toUpperCase()
      .slice(0, 6);
    write(options, female, next);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    write([...options, ""], [...female, ""], [...mapping, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    write(
      options.filter((_, i) => i !== index),
      female.filter((_, i) => i !== index),
      mapping.filter((_, i) => i !== index),
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
        <FieldLabel htmlFor="rank-group-question">Nama kelompok</FieldLabel>
        <Input
          id="rank-group-question"
          value={content?.question ?? ""}
          disabled={locked}
          maxLength={2000}
          placeholder="Contoh: Kelompok A"
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
          <FieldLabel>Daftar pekerjaan dan bidangnya</FieldLabel>
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

        <div className="hidden gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[1.5rem_1fr_1fr_5rem_2.25rem]">
          <span>#</span>
          <span>Laki-laki</span>
          <span>Perempuan</span>
          <span>Bidang</span>
          <span className="sr-only">Aksi</span>
        </div>

        {options.map((option, index) => (
          <div
            key={index}
            className="grid items-start gap-2 sm:grid-cols-[1.5rem_1fr_1fr_5rem_2.25rem]"
          >
            <span className="pt-2 text-sm tabular-nums text-muted-foreground">{index + 1}.</span>
            <Input
              value={option}
              disabled={locked}
              maxLength={120}
              placeholder={`Pekerjaan ${index + 1}`}
              aria-label={`Pekerjaan laki-laki ${index + 1}`}
              onChange={(e) => setOption(index, e.target.value)}
            />
            <Input
              value={female[index] ?? ""}
              disabled={locked}
              maxLength={120}
              placeholder="(sama)"
              aria-label={`Pekerjaan perempuan ${index + 1}`}
              onChange={(e) => setFemale(index, e.target.value)}
            />
            <Input
              className="text-center font-mono uppercase"
              maxLength={6}
              value={mapping[index] ?? ""}
              disabled={locked}
              placeholder="OUT"
              aria-label={`Bidang pekerjaan ${index + 1}`}
              onChange={(e) => setField(index, e.target.value)}
            />
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
        {contentErrors?.femaleOptions && <FieldError errors={[contentErrors.femaleOptions]} />}
        {contentErrors?.mapping && <FieldError errors={[contentErrors.mapping]} />}
      </div>

      <FieldDescription>
        Peserta mengurutkan daftar ini dari yang paling disukai (1) sampai paling tidak disukai.
        Kolom bidang adalah kunci dan tidak pernah dikirim ke peserta; satu interpretasi wajib ada
        untuk tiap bidang yang dipakai. Isi kolom perempuan hanya jika daftarnya berbeda dari
        kolom laki-laki.
      </FieldDescription>
    </>
  );
}
