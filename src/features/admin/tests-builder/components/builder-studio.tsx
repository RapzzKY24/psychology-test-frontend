"use client";

import { BuilderHeader } from "./builder-header";
import { ItemsTab } from "./items-tab";
import { InterpretationsTab } from "./interpretations-tab";
import { SettingsTab } from "./settings-tab";
import { useBuilderForm } from "../hooks/use-builder-form";
import type { AdminTestDetail } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "pengaturan", label: "Pengaturan" },
  { key: "soal", label: "Soal" },
  { key: "interpretasi", label: "Interpretasi" },
] as const;

export function TestBuilderStudio({
  testId,
  initialData,
}: {
  testId: string;
  initialData: AdminTestDetail;
}) {
  const builder = useBuilderForm(testId, initialData);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <BuilderHeader name={initialData.name} status={initialData.status} builder={builder} />

      {builder.locked && (
        <div role="alert" className="border-b bg-chart-3/15 px-6 py-2.5 text-sm text-foreground">
          Tes dikunci — ada peserta yang masih mengerjakan. Perubahan tidak bisa disimpan sampai
          sesinya selesai.
        </div>
      )}

      <div className="flex gap-1 border-b px-6 pt-3" role="tablist" aria-label="Bagian builder">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={builder.tab === t.key}
            onClick={() => builder.setTab(t.key)}
            className={cn(
              "rounded-t-md px-4 py-2 text-sm transition-colors",
              builder.tab === t.key
                ? "border border-b-0 bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {t.key === "soal" && (
              <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">
                {builder.itemsArray.fields.length}
              </span>
            )}
            {t.key === "interpretasi" && (
              <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">
                {builder.interpretationsArray.fields.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {builder.tab === "pengaturan" && <SettingsTab builder={builder} locked={builder.locked} />}
      {builder.tab === "soal" && <ItemsTab builder={builder} locked={builder.locked} />}
      {builder.tab === "interpretasi" && (
        <InterpretationsTab builder={builder} locked={builder.locked} />
      )}
    </div>
  );
}
