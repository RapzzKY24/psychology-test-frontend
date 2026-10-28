"use client";

import type { ArticleBlockInput } from "../schemas";
import { ArticleBlockItem } from "./article-block-item";
import { ArticleBlockToolbar } from "./article-block-toolbar";

/**
 * Structured rich-text editor: the article body is a list of typed blocks
 * (never raw HTML), so the public page can render it safely. Inline images are
 * uploaded through the articles module and stored as served media URLs.
 */
export function ArticleBlocksEditor({
  value,
  onChange,
  invalid,
}: {
  value: ArticleBlockInput[];
  onChange: (blocks: ArticleBlockInput[]) => void;
  invalid?: boolean;
}) {
  const replace = (index: number, block: ArticleBlockInput) =>
    onChange(value.map((b, i) => (i === index ? block : b)));

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <ArticleBlockToolbar onAdd={(block) => onChange([...value, block])} />

      {value.length === 0 && (
        <p className={invalid ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          Belum ada blok isi — tambahkan minimal satu.
        </p>
      )}

      <ul className="space-y-3">
        {value.map((block, index) => (
          <ArticleBlockItem
            key={index}
            block={block}
            index={index}
            total={value.length}
            onChange={(next) => replace(index, next)}
            onMove={(dir) => move(index, dir)}
            onRemove={() => remove(index)}
          />
        ))}
      </ul>
    </div>
  );
}
