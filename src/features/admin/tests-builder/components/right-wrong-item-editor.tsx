"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemImageUpload } from "./item-image-upload";
import { ItemToolbar } from "./item-toolbar";
import { RightWrongOptionsField } from "./right-wrong-options-field";
import { RightWrongShortKeyField } from "./right-wrong-short-key-field";

const ANSWER_MODES = [
  { value: "choice", label: "Pilihan ganda" },
  { value: "short", label: "Isian singkat" },
] as const;

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

  /**
   * The two modes keep different key fields, so switching replaces the content
   * object outright instead of leaving stale `options` next to `accepted`.
   */
  const switchMode = (next: "choice" | "short") => {
    if (next === mode) return;
    const shared = {
      question: content?.question ?? "",
      imageUrl: content?.imageUrl ?? null,
    };
    const draft =
      next === "short"
        ? { answerMode: "short" as const, ...shared, accepted: [""] }
        : {
            answerMode: "choice" as const,
            ...shared,
            options: ["", ""],
            correctIndexes: [0],
          };
    form.setValue(`items.${active}.content`, draft as never, {
      shouldDirty: true,
      shouldValidate: false,
    });
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

      <Field>
        <FieldLabel htmlFor="rw-mode">Bentuk jawaban</FieldLabel>
        <Select
          value={mode}
          disabled={locked}
          onValueChange={(value) => switchMode(value as "choice" | "short")}
        >
          <SelectTrigger id="rw-mode" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANSWER_MODES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Mengganti bentuk jawaban mengosongkan kunci yang sudah diisi.
        </p>
      </Field>

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
