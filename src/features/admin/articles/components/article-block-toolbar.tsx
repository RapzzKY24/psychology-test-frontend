"use client";

import { Heading2, Image as ImageIcon, List as ListIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleBlock } from "@/lib/api/types";
import type { ArticleBlockInput } from "../schemas";
import { newBlock } from "../blocks";

interface ArticleBlockToolbarProps {
  onAdd: (block: ArticleBlockInput) => void;
}

/** Add-block buttons above the body editor. */
export function ArticleBlockToolbar({ onAdd }: ArticleBlockToolbarProps) {
  const buttons: Array<{ type: ArticleBlock["type"]; label: string; icon: typeof Type }> = [
    { type: "paragraph", label: "Paragraf", icon: Type },
    { type: "heading", label: "Judul", icon: Heading2 },
    { type: "list", label: "Daftar", icon: ListIcon },
    { type: "image", label: "Gambar", icon: ImageIcon },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAdd(newBlock(type))}
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </Button>
      ))}
    </div>
  );
}
