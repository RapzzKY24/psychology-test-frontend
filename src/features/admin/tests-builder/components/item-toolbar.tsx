"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemToolbarProps {
  index: number;
  total: number;
  locked: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

/** Item header shared by both builder tabs: number plus reorder/remove. */
export function ItemToolbar({ index, total, locked, onMove, onRemove }: ItemToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">Item #{index + 1}</p>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Naikkan urutan"
          disabled={locked || index === 0}
          onClick={() => onMove(index, index - 1)}
        >
          <ArrowUp className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Turunkan urutan"
          disabled={locked || index === total - 1}
          onClick={() => onMove(index, index + 1)}
        >
          <ArrowDown className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 text-destructive"
          aria-label="Hapus item"
          disabled={locked}
          onClick={onRemove}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
