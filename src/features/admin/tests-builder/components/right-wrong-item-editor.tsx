"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemImageUpload } from "./item-image-upload";
import { ItemToolbar } from "./item-toolbar";
import { RightWrongModeField } from "./right-wrong-mode-field";
import { RightWrongOptionsField } from "./right-wrong-options-field";
import { RightWrongShortKeyField } from "./right-wrong-short-key-field";

interface RightWrongItemEditorProps {
  builder: BuilderController;
  active: number;
  total: number;
  testId: string;
  locked: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

type ItemDraft = {
  answerMode?: "choice" | "short";
  question?: string;
  imageUrl?: string | null;
  options?: string[];
  correctIndexes?: number[];
  accepted?: string[];
};

/** Right pane: one item's question, image, answer mode and key. */
export function RightWrongItemEditor({
  builder,
  active,
  total,
  testId,
  locked,
  onMove,
  onRemove,
  onDuplicate,
}: RightWrongItemEditorProps) {
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const mode = content?.answerMode ?? "choice";

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | {
        question?: { message?: string };
        imageUrl?: { message?: string };
      }
    | undefined;
  const questionError = contentErrors?.question;
  const imageError = contentErrors?.imageUrl;

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

      <RightWrongModeField
        builder={builder}
        active={active}
        mode={mode}
        question={content?.question}
        imageUrl={content?.imageUrl}
        locked={locked}
      />

      <Field data-invalid={questionError ? true : undefined}>
        <FieldLabel htmlFor="rw-question">Pertanyaan (opsional jika ada gambar)</FieldLabel>
        <Textarea
          id="rw-question"
          value={content?.question ?? ""}
          disabled={locked}
          rows={3}
          placeholder="Tulis pertanyaan..."
          aria-invalid={questionError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.question`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {questionError && <FieldError errors={[questionError]} />}
      </Field>

      <ItemImageUpload
        testId={testId}
        value={content?.imageUrl ?? null}
        serverError={imageError?.message ?? null}
        onChange={(url) =>
          form.setValue(`items.${active}.content.imageUrl`, url as never, { shouldDirty: true })
        }
      />

      {mode === "choice" ? (
        <RightWrongOptionsField
          builder={builder}
          active={active}
          options={content?.options ?? ["", ""]}
          correctIndexes={content?.correctIndexes ?? [0]}
          locked={locked}
        />
      ) : (
        <RightWrongShortKeyField
          builder={builder}
          active={active}
          accepted={content?.accepted ?? [""]}
          locked={locked}
        />
      )}
    </>
  );
}
