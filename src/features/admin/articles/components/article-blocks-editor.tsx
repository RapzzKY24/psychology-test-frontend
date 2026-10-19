"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Heading2,
  Image as ImageIcon,
  List as ListIcon,
  Loader2,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { ArticleBlock } from "@/lib/api/types";
import { uploadArticleImage } from "../api";
import type { ArticleBlockInput } from "../schemas";

const BLOCK_LABEL: Record<ArticleBlock["type"], string> = {
  heading: "Judul Bagian",
  paragraph: "Paragraf",
  list: "Daftar",
  image: "Gambar",
};

function newBlock(type: ArticleBlock["type"]): ArticleBlockInput {
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
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, newBlock("paragraph")])}>
          <Type className="size-4" aria-hidden />
          Paragraf
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, newBlock("heading")])}>
          <Heading2 className="size-4" aria-hidden />
          Judul
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, newBlock("list")])}>
          <ListIcon className="size-4" aria-hidden />
          Daftar
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, newBlock("image")])}>
          <ImageIcon className="size-4" aria-hidden />
          Gambar
        </Button>
      </div>

      {value.length === 0 && (
        <p className={invalid ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          Belum ada blok isi — tambahkan minimal satu.
        </p>
      )}

      <ul className="space-y-3">
        {value.map((block, index) => (
          <li key={index} className="rounded-lg border bg-muted/20 p-3">
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
                  onClick={() => move(index, -1)}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Pindah ke bawah"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Hapus blok"
                  onClick={() => remove(index)}
                >
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
                onChange={(e) => replace(index, { type: "heading", text: e.target.value })}
              />
            )}

            {block.type === "paragraph" && (
              <Textarea
                aria-label="Teks paragraf"
                placeholder="Tulis paragraf…"
                rows={4}
                value={block.text}
                maxLength={5000}
                onChange={(e) => replace(index, { type: "paragraph", text: e.target.value })}
              />
            )}

            {block.type === "list" && (
              <ListBlockEditor
                ordered={block.ordered}
                items={block.items}
                onChange={(ordered, items) => replace(index, { type: "list", ordered, items })}
              />
            )}

            {block.type === "image" && (
              <ImageBlockEditor
                url={block.url}
                caption={block.caption ?? ""}
                onChange={(url, caption) => replace(index, { type: "image", url, caption })}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListBlockEditor({
  ordered,
  items,
  onChange,
}: {
  ordered: boolean;
  items: string[];
  onChange: (ordered: boolean, items: string[]) => void;
}) {
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

function ImageBlockEditor({
  url,
  caption,
  onChange,
}: {
  url: string;
  caption: string;
  onChange: (url: string, caption: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const mediaUrl = await uploadArticleImage(file);
      onChange(mediaUrl, caption);
    } catch (error) {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- local upload URL, fixed size
        <img src={url} alt="Pratinjau gambar" className="max-h-56 rounded-md border object-contain" />
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada gambar.</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="file"
          accept="image/png,image/jpeg"
          disabled={uploading}
          aria-label="Unggah gambar"
          className="max-w-xs"
          onChange={(e) => {
            void pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {uploading && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />}
        {url && (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange("", caption)}>
            Hapus gambar
          </Button>
        )}
      </div>
      <Input
        aria-label="Keterangan gambar"
        placeholder="Keterangan (opsional)"
        value={caption}
        maxLength={300}
        onChange={(e) => onChange(url, e.target.value)}
      />
    </div>
  );
}
