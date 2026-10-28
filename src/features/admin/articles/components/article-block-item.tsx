"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BLOCK_LABEL } from "../blocks";
import type { ArticleBlockInput } from "../schemas";
import { ArticleBlockImageEditor } from "./article-block-image-editor";
import { ArticleBlockListEditor } from "./article-block-list-editor";

interface ArticleBlockItemProps {
  block: ArticleBlockInput;
  index: number;
  total: number;
  onChange: (block: ArticleBlockInput) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}

/** One block row: label, reorder/remove controls, and the type-specific field. */
export function ArticleBlockItem({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: ArticleBlockItemProps) {
  return (
    <li className="rounded-lg border bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {BLOCK_LABEL[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Pindah ke atas"
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ChevronUp className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Pindah ke bawah"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ChevronDown className="size-4" aria-hidden />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Hapus blok" onClick={onRemove}>
            <Trash2 className="size-4 text-destructive" aria-hidden />
          </Button>
        </div>
      </div>

      {block.type === "heading" && (
        <Input
          aria-label="Teks judul bagian"
          placeholder="Judul bagian"
          value={block.text}
          maxLength={200}
          onChange={(e) => onChange({ type: "heading", text: e.target.value })}
        />
      )}

      {block.type === "paragraph" && (
        <Textarea
          aria-label="Teks paragraf"
          placeholder="Tulis paragraf…"
          rows={4}
          value={block.text}
          maxLength={5000}
          onChange={(e) => onChange({ type: "paragraph", text: e.target.value })}
        />
      )}

      {block.type === "list" && (
        <ArticleBlockListEditor
          ordered={block.ordered}
          items={block.items}
          onChange={(ordered, items) => onChange({ type: "list", ordered, items })}
        />
      )}

      {block.type === "image" && (
        <ArticleBlockImageEditor
          url={block.url}
          caption={block.caption ?? ""}
          onChange={(url, caption) => onChange({ type: "image", url, caption })}
        />
      )}
    </li>
  );
}
