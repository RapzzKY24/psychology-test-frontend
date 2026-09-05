"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field";
import { useFormContext } from "react-hook-form";
import type { CreateSessionInput } from "../schemas";

interface SessionTestsFieldProps {
  tests: Array<{ id: string; name: string }>;
  disabled: boolean;
}

/** Checkbox multiselect for the ordered PUBLISHED tests — split from the dialog. */
export function SessionTestsField({ tests, disabled }: SessionTestsFieldProps) {
  const { watch, setValue, formState } = useFormContext<CreateSessionInput>();
  const selected = watch("testIds") ?? [];
  const error = formState.errors.testIds;

  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...selected, id] : selected.filter((v) => v !== id);
    setValue("testIds", next, { shouldDirty: true });
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>Tes yang dikerjakan (berurutan)</FieldLabel>
      {tests.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          Belum ada tes PUBLISHED — publish tes dulu di Manajemen Tes.
        </p>
      ) : (
        <FieldGroup className="max-h-40 overflow-y-auto rounded-lg border p-2">
          {tests.map((test) => (
            <label
              key={test.id}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={selected.includes(test.id)}
                disabled={disabled}
                onCheckedChange={(checked) => toggle(test.id, checked === true)}
                aria-label={test.name}
              />
              {test.name}
            </label>
          ))}
        </FieldGroup>
      )}
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
}
