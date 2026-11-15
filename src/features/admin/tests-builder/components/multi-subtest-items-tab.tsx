"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import { multiSubtestSections, subtestRanges } from "@/lib/multi-subtest";
import type { BuilderController } from "../hooks/use-builder-form";
import type { MultiSubtestItemContentInput } from "../schemas";

interface MultiSubtestItemsTabProps {
  builder: BuilderController;
  /** The seed's own config: the only place the subtest split is written down. */
  scoringConfig: unknown;
}

/** What the item asks, short enough for one table cell. */
function preview(content: MultiSubtestItemContentInput): string {
  if (content.kind === "CHOICE") return content.prompt;
  if (content.kind === "PAIR") return content.words.join(" · ");
  if (content.kind === "NUMBER") {
    return content.series?.length ? content.series.join("  ") : (content.prompt ?? "");
  }
  return "Gambar";
}

/** The answer the sheet expects, so the admin can spot a mis-keyed row. */
function keyOf(content: MultiSubtestItemContentInput): string {
  if (content.kind === "PAIR") return "rubrik";
  if (content.kind === "NUMBER") return String(content.key);
  return content.key.toUpperCase();
}

/**
 * A battery is one workbook: 176 items across nine subtests, each with its own
 * printed shape. Editing them one field at a time in a browser form would drift
 * from the source on the first save, so the builder only shows what the seed
 * shipped — the workbook stays the place a correction is made.
 */
export function MultiSubtestItemsTab({ builder, scoringConfig }: MultiSubtestItemsTabProps) {
  const items = builder.form.watch("items");
  const sections = useMemo(() => multiSubtestSections(scoringConfig), [scoringConfig]);

  const grouped = useMemo(
    () =>
      subtestRanges(scoringConfig).map(({ section, from, to }) => ({
        section,
        rows: items.filter((_, index) => index + 1 >= from && index + 1 <= to),
      })),
    [items, scoringConfig],
  );

  if (sections.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Konfigurasi subtes belum terbaca, jadi pembagian soalnya tidak bisa ditampilkan.
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start gap-3 rounded-xl border bg-primary/5 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-medium">Soal mengikuti berkas sumber</p>
          <p className="text-sm text-muted-foreground">
            {items.length} soal dalam {sections.length} subtes dimuat dari berkas IST. Perbaikan
            soal, kunci, dan norma dilakukan di berkas itu lalu dijalankan ulang lewat seed —
            bukan di halaman ini — supaya susunan tetap sama dengan buku aslinya.
          </p>
        </div>
      </div>

      {grouped.map(({ section, rows }) => (
        <section key={section.code} className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums">
                {section.code}
              </span>
              <h3 className="text-sm font-medium">{section.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {rows.length} soal · {section.timeLimitMin} menit
              {section.memorizeMin ? ` · hafalan ${section.memorizeMin} menit` : ""}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="w-16 px-3 py-2 text-left font-medium">No</th>
                  <th className="px-3 py-2 text-left font-medium">Soal</th>
                  <th className="w-24 px-3 py-2 text-right font-medium">Kunci</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const content = row.content as MultiSubtestItemContentInput;
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2">
                        <span className="line-clamp-2">{preview(content)}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{keyOf(content)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
