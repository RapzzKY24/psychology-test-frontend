"use client";

import { useState } from "react";
import { BuilderHeader } from "./builder-header";
import { ChoiceTallyItemsTab } from "./choice-tally-items-tab";
import { ItemsTab } from "./items-tab";
import { PairItemsTab } from "./pair-items-tab";
import { RightWrongItemsTab } from "./right-wrong-items-tab";
import { ScaleTallyItemsTab } from "./scale-tally-items-tab";
import { InterpretationsTab } from "./interpretations-tab";
import { useBuilderForm } from "../hooks/use-builder-form";
import { scorerOption } from "../scorers";
import type { AdminTestDetail } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const TABS = [
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
  // Header name + modal defaults refresh when settings are saved via the modal.
  const [displayName, setDisplayName] = useState(initialData.name);
  const [settingsSnapshot, setSettingsSnapshot] = useState(initialData);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <BuilderHeader
        detail={settingsSnapshot}
        displayName={displayName}
        builder={builder}
        onSettingsSaved={(updated) => {
          setDisplayName(updated.name);
          setSettingsSnapshot((prev) => ({ ...prev, ...updated }));
        }}
      />

      {builder.locked && (
        <div role="alert" className="border-b bg-chart-3/15 px-6 py-2.5 text-sm text-foreground">
          Tes dikunci — ada peserta yang masih mengerjakan. Perubahan tidak bisa disimpan sampai
          sesinya selesai.
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-b px-6 pt-3">
        <div className="flex gap-1" role="tablist" aria-label="Bagian builder">
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
        <p className="pb-2 text-xs text-muted-foreground">
          Tipe soal: {scorerOption(initialData.scorerType).label}
        </p>
      </div>

      {builder.tab === "soal" &&
        (initialData.scorerType === "RIGHT_WRONG_NORM" ? (
          <RightWrongItemsTab builder={builder} locked={builder.locked} testId={testId} />
        ) : initialData.scorerType === "FORCED_CHOICE_PAIR" ? (
          <PairItemsTab builder={builder} locked={builder.locked} />
        ) : initialData.scorerType === "SCALE_TALLY" ? (
          <ScaleTallyItemsTab builder={builder} locked={builder.locked} />
        ) : initialData.scorerType === "CHOICE_TALLY" ? (
          <ChoiceTallyItemsTab builder={builder} locked={builder.locked} />
        ) : (
          <ItemsTab builder={builder} locked={builder.locked} />
        ))}
      {builder.tab === "interpretasi" && (
        <InterpretationsTab builder={builder} locked={builder.locked} />
      )}
    </div>
  );
}
