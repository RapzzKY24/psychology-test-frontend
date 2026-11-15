"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface OptionScaleItemEditorProps {
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
  options?: string[];
  scale?: string;
  reverse?: boolean;
};

const OPTION_LABEL = ["a", "b", "c"];

/**
 * Right pane: one three-option item — the statement, its printed answers, the
 * hidden factor and the flip flag. The participant sees only the statement and
 * the three options; `scale` and `reverse` stay server-side.
 */
export function OptionScaleItemEditor({
  builder,
  active,
  total,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: OptionScaleItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const reverse = content?.reverse === true;
  const options = content?.options ?? [];

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | {
        text?: { message?: string };
        scale?: { message?: string };
        options?: { message?: string } | Array<{ message?: string } | undefined>;
      }
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
        <FieldLabel htmlFor="option-scale-text">Pernyataan</FieldLabel>
        <Textarea
          id="option-scale-text"
          rows={3}
          value={content?.text ?? ""}
          disabled={locked}
          placeholder="Saya merasa ingatan saya jauh lebih baik daripada sebelumnya."
          aria-invalid={textError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.text`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {textError && <FieldError errors={[textError]} />}
      </Field>

      <div className="space-y-3">
        <p className="text-sm font-medium">Pilihan jawaban</p>
        {[0, 1, 2].map((index) => (
          <Field key={index}>
            <FieldLabel htmlFor={`option-scale-option-${index}`} className="sr-only">
              Pilihan {OPTION_LABEL[index]}
            </FieldLabel>
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-medium text-muted-foreground">
                {OPTION_LABEL[index]}
              </span>
              <Input
                id={`option-scale-option-${index}`}
                value={options[index] ?? ""}
                disabled={locked}
                placeholder={index === 1 ? "Di antaranya" : ""}
                onChange={(e) =>
                  form.setValue(`items.${active}.content.options.${index}`, e.target.value as never, {
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </Field>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={scaleError ? true : undefined}>
          <FieldLabel htmlFor="option-scale-factor">Faktor</FieldLabel>
          <Input
            id="option-scale-factor"
            className="w-28 text-center font-mono uppercase"
            maxLength={12}
            value={content?.scale ?? ""}
            disabled={locked}
            placeholder="A"
            aria-invalid={scaleError ? true : undefined}
            onChange={(e) =>
              form.setValue(
                `items.${active}.content.scale`,
                e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() as never,
                { shouldDirty: true },
              )
            }
          />
          {scaleError && <FieldError errors={[scaleError]} />}
        </Field>

        <Field>
          <FieldLabel htmlFor="option-scale-reverse">Arah skor</FieldLabel>
          <label
            htmlFor="option-scale-reverse"
            className="flex h-9 items-center gap-2 text-sm text-muted-foreground"
          >
            <input
              id="option-scale-reverse"
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
            Item reverse — pilihan c bernilai tinggi, a bernilai rendah
          </label>
        </Field>
      </div>

      <FieldDescription>
        Pilihan a selalu bernilai 2 dan c bernilai 0, kecuali item ditandai reverse. Faktor yang
        sama mengumpulkan beberapa item menjadi satu skor yang dikonversi ke sten.
      </FieldDescription>
    </>
  );
}
