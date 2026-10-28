import type { ArticleBlock } from "@/lib/api/types";
import type { ArticleBlockInput } from "./schemas";

export const BLOCK_LABEL: Record<ArticleBlock["type"], string> = {
  heading: "Judul Bagian",
  paragraph: "Paragraf",
  list: "Daftar",
  image: "Gambar",
};

/** Empty block of the requested type, used by the "add block" buttons. */
export function newBlock(type: ArticleBlock["type"]): ArticleBlockInput {
  switch (type) {
    case "heading":
      return { type: "heading", text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "list":
      return { type: "list", ordered: false, items: [""] };
    case "image":
      return { type: "image", url: "", caption: "" };
  }
}
