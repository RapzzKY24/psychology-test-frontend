"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BuilderController } from "../hooks/use-builder-form";

interface RightWrongShortKeyFieldProps {
  builder: BuilderController;
  active: number;
  accepted: string[];
  locked: boolean;
}

type KeyError = { message?: string };

/**
 * Every variant the scorer should accept. Matching folds case, spaces and comma
 * decimals, so `0,125` already covers `0.125` — the list only needs genuinely
 * different answers (`1/9`, `0.111`).
 */
export function RightWrongShortKeyField({
  builder,
  active,
  accepted,
  locked,
}: RightWrongShortKeyFieldProps) {
  const { form } = builder;

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    { accepted?: KeyError[] } | undefined;

  const setAccepted = (next: string[]) =>
    form.setValue(`items.${active}.content.accepted`, next as never, { shouldDirty: true });

  const update = (idx: number, value: string) => {
    const next = [...accepted];
    next[idx] = value;
    setAccepted(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Jawaban benar (varian yang diterima)</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={locked || accepted.length >= 10}
          onClick={() => setAccepted([...accepted, ""])}
        >
          <Plus className="size-4" /> Tambah varian
        </Button>
      </div>

      {accepted.map((value, idx) => {
        const error = contentErrors?.accepted?.[idx];
        return (
          <Field key={idx} data-invalid={error ? true : undefined}>
            <div className="flex gap-2">
              <Input
                value={value}
                disabled={locked}
                placeholder={idx === 0 ? "mis. 0,125" : "mis. 1/8"}
                onChange={(e) => update(idx, e.target.value)}
                className="h-10 flex-1"
                aria-label={`Jawaban benar ${idx + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={locked || accepted.length <= 1}
                onClick={() => setAccepted(accepted.filter((_, i) => i !== idx))}
                aria-label={`Hapus jawaban ${idx + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            {error && <FieldError errors={[error as never]} />}
          </Field>
        );
      })}

      <p className="text-xs text-muted-foreground">
        Huruf besar/kecil, spasi, dan koma desimal diabaikan saat mencocokkan. Tidak ada tebakan
        sinonim — daftarkan sendiri varian yang boleh diterima.
      </p>
    </div>
  );
}
