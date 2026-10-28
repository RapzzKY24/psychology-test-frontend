"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiscItemListProps {
  items: Array<{ content?: { words?: string[] } }>;
  active: number;
  locked: boolean;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

/** Left rail of the DISC tab: four words previewed per row. */
export function DiscItemList({ items, active, locked, onSelect, onAdd }: DiscItemListProps) {
  return (
    <aside className="border-b p-4 lg:border-b-0 lg:border-r">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">
          {items.length} item <span className="text-muted-foreground">/ urutan soal</span>
        </p>
        <Button type="button" variant="outline" size="sm" disabled={locked} onClick={onAdd}>
          <Plus className="size-4" aria-hidden />
          Tambah
        </Button>
      </div>
      <ol className="max-h-[60vh] space-y-1 overflow-y-auto">
        {items.map((item, idx) => {
          const words = item?.content?.words ?? [];
          const filled = words.every((w) => w.trim().length > 0);
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
                <span className="truncate">{words.filter(Boolean).join(" · ") || "(kosong)"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
