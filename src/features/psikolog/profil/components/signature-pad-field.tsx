"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Eraser, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { dataUrlToPngFile, useUploadSignature } from "../hooks/use-signature-pad";

export function SignaturePadField({ onSaved }: { onSaved: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [empty, setEmpty] = useState(true);
  const mutation = useUploadSignature(onSaved);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Hi-dpi: scale backing store so strokes stay crisp.
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);
    const pad = new SignaturePad(canvas, { minWidth: 1.5, maxWidth: 3 });
    const sync = () => setEmpty(pad.isEmpty());
    pad.addEventListener("beginStroke", sync);
    pad.addEventListener("endStroke", sync);
    padRef.current = pad;
    return () => {
      pad.off();
      padRef.current = null;
    };
  }, []);

  const clear = () => {
    padRef.current?.clear();
    setEmpty(true);
  };

  const save = () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    mutation.mutate(dataUrlToPngFile(pad.toDataURL("image/png")));
  };

  return (
    <Field>
      <FieldLabel>Gambar tanda tangan</FieldLabel>
      <canvas
        ref={canvasRef}
        className="h-44 w-full cursor-crosshair touch-none rounded-lg border bg-white"
        aria-label="Kanvas tanda tangan"
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear} disabled={mutation.isPending}>
          <Eraser className="size-4" aria-hidden />
          Hapus
        </Button>
        <Button
          type="button"
          onClick={save}
          disabled={mutation.isPending || empty}
          className="h-11 flex-1"
        >
          <PenLine className="size-4" aria-hidden />
          {mutation.isPending ? "Menyimpan..." : "Simpan Tanda Tangan"}
        </Button>
      </div>
    </Field>
  );
}
