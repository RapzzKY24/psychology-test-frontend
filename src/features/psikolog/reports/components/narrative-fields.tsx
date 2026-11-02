"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { NARRATIVE_FIELDS, NARRATIVE_MAX_LENGTH } from "../rubric";

/**
 * Six narrative blocks. The 800-character cap is the width of the box on the
 * printed template — the backend rejects anything longer.
 */
export function NarrativeFields({
  values,
  onChange,
  readOnly = false,
}: {
  values: Record<string, string>;
  onChange?: (key: string, value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-5">
      {NARRATIVE_FIELDS.map((field) => {
        const value = values[field.key] ?? "";
        return (
          <Field key={field.key}>
            <div className="flex items-baseline justify-between gap-2">
              <FieldLabel htmlFor={`narrative-${field.key}`}>{field.label}</FieldLabel>
              {!readOnly && (
                <span
                  className={
                    value.length >= NARRATIVE_MAX_LENGTH
                      ? "text-xs font-medium text-destructive"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {value.length}/{NARRATIVE_MAX_LENGTH}
                </span>
              )}
            </div>
            {readOnly ? (
              <p className="min-h-16 whitespace-pre-wrap rounded-lg border bg-muted/40 px-3 py-2 text-sm leading-relaxed">
                {value || "Belum diisi"}
              </p>
            ) : (
              <Textarea
                id={`narrative-${field.key}`}
                value={value}
                rows={6}
                maxLength={NARRATIVE_MAX_LENGTH}
                onChange={(event) =>
                  onChange?.(field.key, event.target.value.slice(0, NARRATIVE_MAX_LENGTH))
                }
                className="min-h-32"
              />
            )}
            <FieldDescription>Tercetak di halaman {field.page} laporan.</FieldDescription>
          </Field>
        );
      })}
    </div>
  );
}
