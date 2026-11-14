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
  correctIndexes: number[];
  locked: boolean;
}

type OptionError = { message?: string };

/**
 * Answer options with a checkbox key: one tick renders radios for the
 * participant, several ticks render checkboxes. Options are positional, so
 * removing one has to drag the ticks with it.
 */
export function RightWrongOptionsField({
  builder,
  active,
  options,
  correctIndexes,
  locked,
}: RightWrongOptionsFieldProps) {
  const { form } = builder;

  const contentErrors = form.formState.errors.items?.[active]?.content as unknown as
    { options?: OptionError[]; correctIndexes?: OptionError } | undefined;

  const optionError = (idx: number): OptionError | undefined => contentErrors?.options?.[idx];
  const keyError = contentErrors?.correctIndexes;

  const setOptions = (next: string[]) =>
    form.setValue(`items.${active}.content.options`, next as never, { shouldDirty: true });

  const setKeys = (next: number[]) =>
    form.setValue(`items.${active}.content.correctIndexes`, next as never, {
      shouldDirty: true,
    });

  const updateOption = (idx: number, value: string) => {
    const next = [...options];
    next[idx] = value;
    setOptions(next);
  };

  const addOption = () => {
    if (options.length >= 8) return;
    setOptions([...options, ""]);
  };

  const toggleKey = (idx: number) => {
    setKeys(
      correctIndexes.includes(idx)
        ? correctIndexes.filter((key) => key !== idx)
        : [...correctIndexes, idx].sort((a, b) => a - b),
    );
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = [...options];
    next.splice(idx, 1);
    setOptions(next);
    // Positional keys shift down with the options — otherwise the key silently
    // jumps to the next answer.
    setKeys(correctIndexes.filter((key) => key !== idx).map((key) => (key > idx ? key - 1 : key)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Pilihan jawaban (2–8)</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={locked || options.length >= 8}
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
                  type="checkbox"
                  checked={correctIndexes.includes(idx)}
                  disabled={locked}
                  onChange={() => toggleKey(idx)}
                  className="size-4"
                  aria-label={`Kunci opsi ${idx + 1}`}
                />
                {/* Position, not a letter: a figure item stores "a"–"f" as the
                    option itself, so an "A." marker would read "A. a". */}
                <span className="text-sm tabular-nums text-muted-foreground">{idx + 1}.</span>
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

      {keyError && <FieldError errors={[keyError as never]} />}

      <p className="text-xs text-muted-foreground">
        Centang jawaban yang benar. Satu centang = peserta memilih satu, lebih dari satu = peserta
        memilih beberapa.
      </p>
    </div>
  );
}
