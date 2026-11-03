"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BuilderController } from "../hooks/use-builder-form";

const ANSWER_MODES = [
  { value: "choice", label: "Pilihan ganda" },
  { value: "short", label: "Isian singkat" },
] as const;

type AnswerMode = (typeof ANSWER_MODES)[number]["value"];

interface RightWrongModeFieldProps {
  builder: BuilderController;
  active: number;
  mode: AnswerMode;
  question?: string;
  imageUrl?: string | null;
  locked: boolean;
}

/**
 * The two modes keep different key fields, so switching replaces the content
 * object outright instead of leaving stale `options` next to `accepted`.
 */
export function RightWrongModeField({
  builder,
  active,
  mode,
  question,
  imageUrl,
  locked,
}: RightWrongModeFieldProps) {
  const { form } = builder;

  const switchMode = (next: AnswerMode) => {
    if (next === mode) return;
    const shared = { question: question ?? "", imageUrl: imageUrl ?? null };
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
    <Field>
      <FieldLabel htmlFor="rw-mode">Bentuk jawaban</FieldLabel>
      <Select
        value={mode}
        disabled={locked}
        onValueChange={(value) => switchMode(value as AnswerMode)}
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
  );
}
