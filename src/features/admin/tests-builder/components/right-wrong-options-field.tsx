"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BuilderController } from "../hooks/use-builder-form";

interface RightWrongOptionsFieldProps {
  builder: BuilderController;
  active: number;
  options: string[];
  correctIndex: number;
  locked: boolean;
}

type OptionError = { message?: string };

/** Answer options with the single-choice key radio, 2–6 rows. */
export function RightWrongOptionsField({
  builder,
  active,
  options,
  correctIndex,
  locked,
}: RightWrongOptionsFieldProps) {
  const { form } = builder;

  const optionError = (idx: number): OptionError | undefined => {
    const content = form.formState.errors.items?.[active]?.content as unknown as {
      options?: OptionError[];
    };
    return content?.options?.[idx];
  };

  const setOptions = (next: string[]) =>
    form.setValue(`items.${active}.content.options`, next as never, { shouldDirty: true });

  const updateOption = (idx: number, value: string) => {
    const next = [...options];
    next[idx] = value;
    setOptions(next);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = [...options];
    next.splice(idx, 1);
    setOptions(next);
    if (correctIndex >= next.length) {
      form.setValue(`items.${active}.content.correctIndex`, next.length - 1 as never, {
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Pilihan jawaban (2–6)</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={locked || options.length >= 6}
          onClick={addOption}
        >
          <Plus className="size-4" /> Tambah opsi
        </Button>
      </div>

      {options.map((opt, idx) => {
        const error = optionError(idx);
        return (
          <Field key={idx} data-invalid={error ? true : undefined}>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${active}`}
                  checked={correctIndex === idx}
                  disabled={locked}
                  onChange={() =>
                    form.setValue(`items.${active}.content.correctIndex`, idx as never, {
                      shouldDirty: true,
                    })
                  }
                  className="size-4"
                  aria-label={`Kunci opsi ${idx + 1}`}
                />
                <span className="text-sm tabular-nums">{String.fromCharCode(65 + idx)}.</span>
              </div>
              <Input
                value={opt}
                disabled={locked}
                placeholder={`Opsi ${idx + 1}`}
                onChange={(e) => updateOption(idx, e.target.value)}
                className="h-10 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={locked || options.length <= 2}
                onClick={() => removeOption(idx)}
                aria-label={`Hapus opsi ${idx + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            {error && <FieldError errors={[error as never]} />}
          </Field>
        );
      })}

      <p className="text-xs text-muted-foreground">
        Pilih radio untuk kunci jawaban. Minimal 2 opsi, maksimal 6.
      </p>
    </div>
  );
}
