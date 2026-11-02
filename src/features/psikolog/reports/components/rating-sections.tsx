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

/** I–IV: the 13 rated aspects. The psychologist picks one of R/K/C/B/T. */
export function RatingSections({
  values,
  onChange,
}: {
  values: Record<string, RatingValue | "">;
  onChange: (key: string, value: RatingValue) => void;
}) {
  return (
    <div className="space-y-4">
      {RATING_SECTIONS.map((section) => (
        <section key={section.id} className="overflow-hidden rounded-lg border">
          <header className="border-b bg-muted/50 px-4 py-2.5">
            <h2 className="text-sm font-semibold">{section.label}</h2>
          </header>
          <ul className="divide-y">
            {section.aspects.map((aspect) => (
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
                <Select
                  value={values[aspect.key] || undefined}
                  onValueChange={(value) => onChange(aspect.key, value as RatingValue)}
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
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
