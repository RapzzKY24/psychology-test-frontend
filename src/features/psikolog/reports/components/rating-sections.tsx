"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RatingValue } from "@/lib/api/types";
import { RATING_LABELS, RATING_SECTIONS, RATING_VALUES } from "../rubric";

/**
 * I–IV: the 13 rated aspects. The psychologist picks one of R/K/C/B/T.
 * `readOnly` renders the stored value as text — an issued report is frozen, so
 * there is no control to click.
 */
export function RatingSections({
  values,
  onChange,
  readOnly = false,
}: {
  values: Record<string, RatingValue | "">;
  onChange?: (key: string, value: RatingValue) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      {RATING_SECTIONS.map((section) => (
        <section key={section.id} className="overflow-hidden rounded-lg border">
          <header className="border-b bg-muted/50 px-4 py-2.5">
            <h2 className="text-sm font-semibold">{section.label}</h2>
          </header>
          <ul className="divide-y">
            {section.aspects.map((aspect) => {
              const current = values[aspect.key];
              return (
                <li
                  key={aspect.key}
                  className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 md:pr-6">
                    <p className="text-sm font-medium">{aspect.label}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {aspect.description}
                    </p>
                  </div>
                  {readOnly ? (
                    <span className="w-full rounded-lg border bg-muted/40 px-2.5 py-2 text-sm font-medium md:w-44">
                      {current ? `${current} — ${RATING_LABELS[current]}` : "Belum diisi"}
                    </span>
                  ) : (
                    <Select
                      value={current || undefined}
                      onValueChange={(value) => onChange?.(aspect.key, value as RatingValue)}
                    >
                      <SelectTrigger className="w-full md:w-44" aria-label={aspect.label}>
                        <SelectValue placeholder="Pilih nilai" />
                      </SelectTrigger>
                      <SelectContent>
                        {RATING_VALUES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value} — {RATING_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
