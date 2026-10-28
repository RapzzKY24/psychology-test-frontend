"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ArticleBlockListEditorProps {
  ordered: boolean;
  items: string[];
  onChange: (ordered: boolean, items: string[]) => void;
}

export function ArticleBlockListEditor({
  ordered,
  items,
  onChange,
}: ArticleBlockListEditorProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={ordered} onCheckedChange={(v) => onChange(v === true, items)} />
        Daftar bernomor
      </label>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
              {ordered ? `${i + 1}.` : "•"}
            </span>
            <Input
              aria-label={`Poin ${i + 1}`}
              value={item}
              maxLength={1000}
              onChange={(e) => onChange(ordered, items.map((it, j) => (j === i ? e.target.value : it)))}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Hapus poin ${i + 1}`}
              disabled={items.length === 1}
              onClick={() => onChange(ordered, items.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4 text-destructive" aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={items.length >= 50}
        onClick={() => onChange(ordered, [...items, ""])}
      >
        <Plus className="size-4" aria-hidden />
        Tambah poin
      </Button>
    </div>
  );
}
