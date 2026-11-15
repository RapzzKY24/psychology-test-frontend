"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { CheckCircle2, Eraser, PenLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import type { ManualMark } from "@/lib/api/types";
import { uploadItemImage } from "../api";
import { MANUAL_MARK_LABELS, paintStimulus } from "../lib/manual-marks";

interface ManualItemViewProps {
  attemptId: string;
  itemId: string;
  /** Printed box number, 1–8. */
  box: number;
  /** What is printed inside the box. */
  mark: ManualMark;
  /** Server path of the drawing already saved for this box, if any. */
  imageUrl: string | null;
  participantToken: string | null;
  disabled: boolean;
  onSaved: (imageUrl: string) => void;
}

/**
 * One box of the drawing sheet. Two layers: the lower canvas holds what the
 * sheet already printed (or the drawing saved earlier), the upper one holds
 * the participant's strokes. Saving flattens both into one PNG, so the
 * psychologist sees the drawing the way it would look on paper.
 *
 * The strokes are never sent as coordinates — the upload route stores the PNG
 * and answers with the path, which is what the runner records.
 */
export function ManualItemView({
  attemptId,
  itemId,
  box,
  mark,
  imageUrl,
  participantToken,
  disabled,
  onSaved,
}: ManualItemViewProps) {
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  /** The drawing currently painted under the strokes, so a re-render does not refetch it. */
  const loadedRef = useRef<string | null>(null);
  const [empty, setEmpty] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  /** Repaint the lower layer with the printed mark only. */
  const paintMark = useCallback(() => {
    const canvas = backgroundRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(ratio, ratio);
    paintStimulus(ctx, mark, canvas.width / ratio, canvas.height / ratio);
    ctx.restore();
  }, [mark]);

  // Both canvases share one backing size; hi-dpi keeps the thin printed lines
  // and the pen equally crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    const background = backgroundRef.current;
    if (!canvas || !background) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const { width, height } = canvas.getBoundingClientRect();
    for (const element of [canvas, background]) {
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
    }

    const pad = new SignaturePad(canvas, {
      minWidth: 1.2,
      maxWidth: 2.6,
      penColor: "#18181b",
    });
    const sync = () => {
      setEmpty(pad.isEmpty());
      setDirty(true);
    };
    pad.addEventListener("beginStroke", sync);
    pad.addEventListener("endStroke", sync);
    padRef.current = pad;
    paintMark();

    return () => {
      pad.off();
      padRef.current = null;
    };
  }, [paintMark]);

  /**
   * A box already saved comes back as a finished picture, so it is painted
   * under the strokes and the participant may add to it. The image route needs
   * the guest token, which an `<img>` cannot send — hence the fetch.
   */
  useEffect(() => {
    if (!imageUrl) {
      loadedRef.current = null;
      paintMark();
      return;
    }
    if (loadedRef.current === imageUrl) return;

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(imageUrl, {
          credentials: "include",
          headers: participantToken ? { "x-participant-token": participantToken } : undefined,
        });
        if (!response.ok) throw new Error("drawing not readable");
        const objectUrl = URL.createObjectURL(await response.blob());
        const image = new Image();
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("drawing not decodable"));
          image.src = objectUrl;
        });
        const canvas = backgroundRef.current;
        const ctx = canvas?.getContext("2d");
        if (!cancelled && canvas && ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          loadedRef.current = imageUrl;
          setDirty(false);
        }
        URL.revokeObjectURL(objectUrl);
      } catch {
        // The answer is still recorded; only the preview failed to load.
        if (!cancelled) paintMark();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, participantToken, paintMark]);

  const clear = () => {
    padRef.current?.clear();
    setEmpty(true);
    setDirty(true);
  };

  const save = async () => {
    const pad = padRef.current;
    const background = backgroundRef.current;
    const strokes = canvasRef.current;
    if (!pad || !background || !strokes || pad.isEmpty()) return;

    const flat = document.createElement("canvas");
    flat.width = background.width;
    flat.height = background.height;
    const ctx = flat.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(strokes, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      flat.toBlob(resolve, "image/png"),
    );
    if (!blob) {
      toast.error(GENERIC_ERROR_MESSAGE);
      return;
    }

    setSaving(true);
    try {
      const file = new File([blob], "drawing.png", { type: "image/png" });
      const { data } = await uploadItemImage(
        attemptId,
        itemId,
        file,
        participantToken ?? undefined,
      );
      loadedRef.current = data.imageUrl;
      setDirty(false);
      onSaved(data.imageUrl);
      toast.success("Gambar tersimpan.");
    } catch (error) {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  const blocked = disabled || saving;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Kotak {box}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {imageUrl && !dirty ? (
            <>
              <CheckCircle2 className="size-3.5 text-primary" aria-hidden />
              Tersimpan
            </>
          ) : (
            "Belum disimpan"
          )}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {MANUAL_MARK_LABELS[mark]} sudah tercetak di kotak. Lengkapi gambar itu
        menjadi satu gambar utuh — tidak ada jawaban benar atau salah.
      </p>

      <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border bg-white">
        <canvas
          ref={backgroundRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        />
        <canvas
          ref={canvasRef}
          aria-label={`Kanvas kotak ${box}`}
          className={cn(
            "absolute inset-0 size-full cursor-crosshair touch-none",
            disabled && "pointer-events-none opacity-60",
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clear}
          disabled={blocked || empty}
          className="h-11"
        >
          <Eraser className="size-4" aria-hidden />
          Hapus
        </Button>
        <Button type="button" onClick={() => void save()} disabled={blocked || empty} className="h-11">
          <PenLine className="size-4" aria-hidden />
          {saving ? "Menyimpan..." : "Simpan gambar"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Gambar baru terkirim setelah Anda menekan Simpan. Menghapus goresan
        tidak menghapus gambar yang sudah tersimpan.
      </p>
    </div>
  );
}
