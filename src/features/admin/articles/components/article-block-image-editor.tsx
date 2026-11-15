"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadArticleImage } from "../hooks/use-upload-article-image";

interface ArticleBlockImageEditorProps {
  url: string;
  caption: string;
  onChange: (url: string, caption: string) => void;
}

export function ArticleBlockImageEditor({
  url,
  caption,
  onChange,
}: ArticleBlockImageEditorProps) {
  const { upload, uploading } = useUploadArticleImage({
    onUploaded: (mediaUrl) => onChange(mediaUrl, caption),
  });

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
            void upload(e.target.files?.[0]);
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
