"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPairItemReady, isStyleGridItemReady } from "../item-readiness";

interface PairItemListProps {
  items: Array<{ content?: { question?: string; statements?: string[]; mapping?: string[] } }>;
  active: number;
  locked: boolean;
  /** "style" rows may score the same code twice, so they read differently. */
  codeKind?: "pole" | "need" | "style";
  onSelect: (index: number) => void;
  onAdd: () => void;
}

/** Left rail of the pair tab: one row per item, plus the add button. */
export function PairItemList({
  items,
  active,
  locked,
  codeKind = "pole",
  onSelect,
  onAdd,
}: PairItemListProps) {
  return (
    <aside className="border-b p-4 lg:border-b-0 lg:border-r">
      <div className="mb-3 space-y-2">
        <p className="text-sm font-medium">
          {items.length} item <span className="text-muted-foreground">/ urutan soal</span>
        </p>
        <Button type="button" variant="outline" size="sm" className="w-full" disabled={locked} onClick={onAdd}>
          <Plus className="size-4" aria-hidden />
          Tambah
        </Button>
      </div>
      <ol className="max-h-[60vh] space-y-1 overflow-y-auto">
        {items.map((item, idx) => {
          const content = item?.content;
          const label =
            content?.question?.trim() || content?.statements?.[0]?.trim() || "(kosong)";
          const filled =
            codeKind === "style" ? isStyleGridItemReady(content) : isPairItemReady(content);
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => onSelect(idx)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                  idx === active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md text-xs tabular-nums",
                    filled ? "bg-primary/15 text-primary" : "border border-dashed",
                  )}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
