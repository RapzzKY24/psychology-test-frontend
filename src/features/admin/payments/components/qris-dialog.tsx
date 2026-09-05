"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { uploadQrisImage } from "../api";

export function QrisDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error(GENERIC_ERROR_MESSAGE);
      return uploadQrisImage(file);
    },
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("QRIS merchant terunggah.");
      setOpen(false);
      setFile(null);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });

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
          className="flex h-32 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
        >
          <Upload className="size-4" aria-hidden />
          {file ? file.name : "Pilih gambar QRIS (png/jpg ≤2MB)"}
        </button>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()} disabled={!file || mutation.isPending}>
            {mutation.isPending ? "Mengunggah..." : "Unggah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
