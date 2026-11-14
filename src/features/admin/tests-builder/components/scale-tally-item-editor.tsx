"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface ScaleTallyItemEditorProps {
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
  scale?: string;
};

const LABELS = [0, 1];

/** Right pane: one statement, its two labels, and the scale it feeds. */
export function ScaleTallyItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: ScaleTallyItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const options = content?.options ?? ["Ya", "Tidak"];

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    { question?: { message?: string }; scale?: { message?: string } } | undefined;
  const questionError = contentErrors?.question;
  const scaleError = contentErrors?.scale;

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
        <FieldLabel htmlFor="scale-tally-question">Pernyataan</FieldLabel>
        <Textarea
          id="scale-tally-question"
          value={content?.question ?? ""}
          disabled={locked}
          rows={3}
          placeholder="Contoh: Senang menonton drama"
          aria-invalid={questionError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.question`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {questionError && <FieldError errors={[questionError]} />}
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
        {LABELS.map((index) => (
          <Field key={index}>
            <FieldLabel htmlFor={`scale-tally-label-${index}`}>
              Label {index === 0 ? "setuju" : "tidak setuju"}
            </FieldLabel>
            <Input
              id={`scale-tally-label-${index}`}
              value={options[index] ?? ""}
              disabled={locked}
              maxLength={200}
              placeholder={index === 0 ? "Ya" : "Tidak"}
              onChange={(e) =>
                form.setValue(`items.${active}.content.options.${index}`, e.target.value as never, {
                  shouldDirty: true,
                })
              }
            />
          </Field>
        ))}
        <Field data-invalid={scaleError ? true : undefined}>
          <FieldLabel htmlFor="scale-tally-scale">Skala</FieldLabel>
          <Input
            id="scale-tally-scale"
            className="text-center font-mono uppercase"
            maxLength={4}
            value={content?.scale ?? ""}
            disabled={locked}
            placeholder="R"
            aria-invalid={scaleError ? true : undefined}
            onChange={(e) =>
              form.setValue(
                `items.${active}.content.scale`,
                e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase() as never,
                { shouldDirty: true },
              )
            }
          />
          {scaleError && <FieldError errors={[scaleError]} />}
        </Field>
      </div>

      <FieldDescription>
        Jawaban pertama menambah satu poin ke skala item ini; jawaban kedua tidak menambah poin.
        Skala adalah kunci — peserta tidak pernah menerimanya. Satu interpretasi wajib ada untuk
        tiap skala yang dipakai.
      </FieldDescription>
    </>
  );
}
