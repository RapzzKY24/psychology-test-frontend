"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BuilderController } from "../hooks/use-builder-form";
import { ItemToolbar } from "./item-toolbar";

interface PairItemEditorProps {
  builder: BuilderController;
  active: number;
  total: number;
  locked: boolean;
  /**
   * "pole" for a dichotomy (MBTI), "need" for a per-statement scale (PAPI),
   * "style" for a grid whose two statements may share one style (MSDT).
   */
  codeKind?: "pole" | "need" | "norm" | "style";
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

type ItemDraft = {
  question?: string;
  statements?: string[];
  mapping?: string[];
};

const STATEMENTS = [0, 1];
const SIDE_LABEL = ["A", "B"];

const CODE_COPY = {
  pole: {
    label: "Kutub",
    placeholders: ["E", "I"] as const,
    hint: "Dua pernyataan harus mewakili kutub berbeda (mis. E dan I).",
  },
  need: {
    label: "Kebutuhan",
    placeholders: ["N", "G"] as const,
    hint: "Tiap pernyataan menambah skor satu kebutuhan; dua pernyataan dalam satu soal harus berbeda.",
  },
  norm: {
    label: "Kebutuhan",
    placeholders: ["ACH", "DEF"] as const,
    hint: "Tiap pernyataan menambah skor satu kebutuhan; kedua pernyataan boleh menunjuk kebutuhan yang sama — butir seperti itu tidak dinilai.",
  },
  style: {
    label: "Gaya",
    placeholders: ["DS", "MI"] as const,
    hint: "Tiap pernyataan menambah skor satu gaya; kedua pernyataan boleh menunjuk gaya yang sama.",
  },
};

/** Right pane: one pair item — stem, two statements, and the hidden code of each. */
export function PairItemEditor({
  builder,
  active,
  total,
  locked,
  codeKind = "pole",
  onMove,
  onRemove,
  onDuplicate,
}: PairItemEditorProps) {
  const copy = CODE_COPY[codeKind];
  const { form } = builder;
  const content = form.watch(`items.${active}.content`) as unknown as ItemDraft | undefined;
  const statements = content?.statements ?? ["", ""];
  const mapping = content?.mapping ?? ["", ""];

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    | { question?: { message?: string }; mapping?: Array<{ message?: string } | undefined> }
    | undefined;
  const questionError = contentErrors?.question;
  const poleError = contentErrors?.mapping?.[1];

  const setPole = (index: number, value: string) =>
    form.setValue(
      `items.${active}.content.mapping.${index}`,
      value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase() as never,
      { shouldDirty: true },
    );

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
        <FieldLabel htmlFor="pair-question">Pertanyaan</FieldLabel>
        <Textarea
          id="pair-question"
          value={content?.question ?? ""}
          disabled={locked}
          rows={2}
          placeholder="Contoh: Mana yang lebih menggambarkan diri Anda?"
          aria-invalid={questionError ? true : undefined}
          onChange={(e) =>
            form.setValue(`items.${active}.content.question`, e.target.value as never, {
              shouldDirty: true,
            })
          }
        />
        {questionError && <FieldError errors={[questionError]} />}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        {STATEMENTS.map((index) => (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <Field>
              <FieldLabel htmlFor={`pair-statement-${index}`}>
                Pernyataan {SIDE_LABEL[index]}
              </FieldLabel>
              <Textarea
                id={`pair-statement-${index}`}
                rows={4}
                value={statements[index] ?? ""}
                disabled={locked}
                placeholder={
                  index === 0 ? "Saya suka bertemu orang baru" : "Saya nyaman bekerja sendiri"
                }
                onChange={(e) =>
                  form.setValue(
                    `items.${active}.content.statements.${index}`,
                    e.target.value as never,
                    { shouldDirty: true },
                  )
                }
              />
            </Field>
            <Field data-invalid={poleError ? true : undefined}>
              <FieldLabel htmlFor={`pair-pole-${index}`}>{copy.label}</FieldLabel>
              <Input
                id={`pair-pole-${index}`}
                className="w-20 text-center font-mono uppercase"
                maxLength={3}
                value={mapping[index] ?? ""}
                disabled={locked}
                placeholder={copy.placeholders[index]}
                aria-invalid={poleError ? true : undefined}
                onChange={(e) => setPole(index, e.target.value)}
              />
            </Field>
          </div>
        ))}
      </div>
      {poleError && <FieldError errors={[poleError]} />}

      <FieldDescription>
        Peserta hanya melihat pertanyaan dan kedua pernyataan — kode {copy.label.toLowerCase()}{" "}
        tidak pernah dikirim ke peserta. {copy.hint}
      </FieldDescription>
    </>
  );
}
