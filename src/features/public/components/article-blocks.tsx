import { cn } from "@/lib/utils";
import type { ArticleBlock } from "@/lib/api/types/articles";

/**
 * Safe rich-text renderer for article blocks. Blocks are a discriminated union
 * validated by Zod on both sides (BE + FE) — no raw HTML, no dangerouslySetInnerHTML.
 */
export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="text-xl font-semibold tracking-tight">
                {block.text}
              </h2>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={cn(
                  "space-y-2 pl-6 text-muted-foreground",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }
          case "image":
            return (
              <figure key={index} className="space-y-2">
                {/* Local upload URL — next/image processing is unnecessary here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.url} alt={block.caption ?? "Gambar artikel"} className="w-full rounded-2xl object-cover" />
                {block.caption ? <figcaption className="text-center text-sm text-muted-foreground">{block.caption}</figcaption> : null}
              </figure>
            );
        }
      })}
    </div>
  );
}
