import { ArticleBlock } from "@/lib/api/types/articles";

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
          case "list":
            return (
              <ul key={index} className="list-disc space-y-2 pl-6 text-muted-foreground">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
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
