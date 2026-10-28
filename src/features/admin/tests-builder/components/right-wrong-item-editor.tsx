"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemImageUpload } from "./item-image-upload";
import { ItemToolbar } from "./item-toolbar";
import { RightWrongOptionsField } from "./right-wrong-options-field";

interface RightWrongItemEditorProps {
  builder: BuilderController;
  active: number;
  total: number;
  testId: string;
  locked: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

/** Right pane: one item's question, image and answer options. */
export function RightWrongItemEditor({
  builder,
  active,
  total,
  testId,
  locked,
  onMove,
  onRemove,
}: RightWrongItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as
    | {
        question?: string;
        imageUrl?: string | null;
        options?: string[];
        correctIndex?: number;
      }
    | undefined;

  const contentError = form.formState.errors.items?.[active]?.content as unknown as
    | { message?: string }
    | undefined;

  return (
    <>
      <ItemToolbar
        index={active}
        total={total}
        locked={locked}
        onMove={onMove}
        onRemove={onRemove}
      />

      <Field>
        <FieldLabel htmlFor="rw-question">Pertanyaan (opsional jika ada gambar)</FieldLabel>
        <Textarea
          id="rw-question"
          value={content?.question ?? ""}
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
        value={content?.imageUrl ?? null}
        onChange={(url) =>
          form.setValue(`items.${active}.content.imageUrl`, url as never, { shouldDirty: true })
        }
      />

      <RightWrongOptionsField
        builder={builder}
        active={active}
        options={content?.options ?? ["", ""]}
        correctIndex={content?.correctIndex ?? 0}
        locked={locked}
      />

      {contentError && (
        <p className="text-sm text-destructive">
          {contentError.message ?? "Periksa field yang bertanda merah."}
        </p>
      )}
    </>
  );
}
