"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface LikertItemEditorProps {
  builder: BuilderController;
  active: number;
  total: number;
  locked: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

type ItemDraft = {
  text?: string;
  scale?: string;
  reverse?: boolean;
};

/** Right pane: one Likert item — the statement, the hidden scale, and the flip flag. */
export function LikertItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: LikertItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const reverse = content?.reverse === true;

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | { text?: { message?: string }; scale?: { message?: string } }
    | undefined;
  const textError = contentErrors?.text;
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

      <Field data-invalid={textError ? true : undefined}>
        <FieldLabel htmlFor="likert-text">Pernyataan</FieldLabel>
        <Textarea
          id="likert-text"
          rows={3}
          value={content?.text ?? ""}
          disabled={locked}
          placeholder="Saya adalah orang yang aktif berbicara"
          aria-invalid={textError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.text`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {textError && <FieldError errors={[textError]} />}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={scaleError ? true : undefined}>
          <FieldLabel htmlFor="likert-scale">Skala</FieldLabel>
          <Input
            id="likert-scale"
            className="w-28 text-center font-mono uppercase"
            maxLength={12}
            value={content?.scale ?? ""}
            disabled={locked}
            placeholder="E"
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

        <Field>
          <FieldLabel htmlFor="likert-reverse">Arah skor</FieldLabel>
          <label
            htmlFor="likert-reverse"
            className="flex h-9 items-center gap-2 text-sm text-muted-foreground"
          >
            <input
              id="likert-reverse"
              type="checkbox"
              className="size-4"
              checked={reverse}
              disabled={locked}
              onChange={(e) =>
                form.setValue(`items.${active}.content.reverse`, e.target.checked as never, {
                  shouldDirty: true,
                })
              }
            />
            Item reverse — skor dibalik (min + max − jawaban)
          </label>
        </Field>
      </div>

      <FieldDescription>
        Peserta hanya melihat pernyataan dan pilihan angka — kode skala dan tanda reverse tidak
        pernah dikirim ke peserta. Skala yang sama mengumpulkan beberapa pernyataan menjadi satu
        trait.
      </FieldDescription>
    </>
  );
}
