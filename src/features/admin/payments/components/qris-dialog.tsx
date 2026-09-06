"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQrisUpload } from "../hooks/use-qris-upload";
import { QrisPreviewImage } from "./qris-preview-image";

export function QrisDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useQrisUpload(() => {
    setOpen(false);
    setFile(null);
    setCacheKey(Date.now());
  });

  // Derived object-URL preview; revoked when the file changes or dialog unmounts.
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const pick = (selected: File | null) => {
    if (!selected) return;
    if (!["image/png", "image/jpeg"].includes(selected.type)) {
      toast.error("Hanya PNG atau JPG.");
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      toast.error("Maksimal 2MB.");
      return;
    }
    setFile(selected);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFile(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImageIcon className="size-4" aria-hidden />
          QRIS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gambar QRIS Merchant</DialogTitle>
          <DialogDescription>
            PNG/JPG, maksimal 2MB. Gambar ini tampil di popup pembayaran peserta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            QRIS aktif (yang dilihat peserta)
          </p>
          <QrisPreviewImage key={cacheKey} cacheKey={cacheKey} />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
        >
          <Upload className="size-4" aria-hidden />
          {file ? file.name : "Pilih gambar QRIS baru (png/jpg ≤2MB)"}
        </button>
        {filePreview && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Preview file terpilih
            </p>
            <div className="flex h-40 items-center justify-center rounded-lg border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filePreview}
                alt="Preview gambar QRIS terpilih"
                className="max-h-36 object-contain"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => mutation.mutate(file!)} disabled={!file || mutation.isPending}>
            {mutation.isPending ? "Mengunggah..." : "Unggah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
