"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface ChoiceTallyItemEditorProps {
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
  mapping?: string[];
};

const MAX_OPTIONS = 8;
const MIN_OPTIONS = 2;

/** Right pane: one question, its options, and the scale each option feeds. */
export function ChoiceTallyItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: ChoiceTallyItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const options = content?.options ?? ["", ""];
  const mapping = content?.mapping ?? ["", ""];

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    { question?: { message?: string }; mapping?: { message?: string } } | undefined;
  const questionError = contentErrors?.question;
  const mappingError = contentErrors?.mapping;

  const write = (nextOptions: string[], nextMapping: string[]) => {
    form.setValue(`items.${active}.content.options`, nextOptions as never, {
      shouldDirty: true,
    });
    form.setValue(`items.${active}.content.mapping`, nextMapping as never, {
      shouldDirty: true,
    });
  };

  const setOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    write(next, mapping);
  };

  const setScale = (index: number, value: string) => {
    const next = [...mapping];
    next[index] = value
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 4);
    write(options, next);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    write([...options, ""], [...mapping, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    write(
      options.filter((_, i) => i !== index),
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

      <Field data-invalid={questionError ? true : undefined}>
        <FieldLabel htmlFor="choice-tally-question">Pertanyaan</FieldLabel>
        <Textarea
          id="choice-tally-question"
          value={content?.question ?? ""}
          disabled={locked}
          rows={2}
          placeholder="Contoh: Bagi saya, kesulitan adalah …"
          aria-invalid={questionError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.question`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {questionError && <FieldError errors={[questionError]} />}
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Opsi dan skala</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={locked || options.length >= MAX_OPTIONS}
            onClick={addOption}
          >
            <Plus className="size-4" aria-hidden />
            Tambah opsi
          </Button>
        </div>

        {options.map((option, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2 w-5 shrink-0 text-sm tabular-nums text-muted-foreground">
              {index + 1}.
            </span>
            <Input
              value={option}
              disabled={locked}
              maxLength={500}
              placeholder={`Opsi ${index + 1}`}
              aria-label={`Opsi ${index + 1}`}
              onChange={(e) => setOption(index, e.target.value)}
            />
            <Input
              className="w-20 text-center font-mono uppercase"
              maxLength={4}
              value={mapping[index] ?? ""}
              disabled={locked}
              placeholder="Q"
              aria-label={`Skala opsi ${index + 1}`}
              onChange={(e) => setScale(index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={locked || options.length <= MIN_OPTIONS}
              aria-label={`Hapus opsi ${index + 1}`}
              onClick={() => removeOption(index)}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        ))}
        {mappingError && <FieldError errors={[mappingError]} />}
      </div>

      <FieldDescription>
        Setiap opsi menambah satu poin ke skala di sebelahnya — tidak ada jawaban benar atau salah.
        Skala adalah kunci dan tidak pernah dikirim ke peserta. Satu interpretasi wajib ada untuk
        tiap skala yang dipakai.
      </FieldDescription>
    </>
  );
}
