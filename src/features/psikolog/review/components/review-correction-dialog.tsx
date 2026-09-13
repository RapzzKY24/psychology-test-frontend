"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PencilLine } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { FORM_INVALID_TOAST } from "@/features/admin/copy";
import { useApplyCorrection } from "../hooks/use-review-actions";

const CorrectionFormSchema = z.object({
  patternCode: z.string().trim().min(1, "Kode pola wajib diisi."),
  reason: z.string().trim().min(10, "Alasan minimal 10 karakter.").max(2000),
  scoresText: z.string().min(1, "Skor wajib diisi."),
});

type CorrectionFormInput = z.infer<typeof CorrectionFormSchema>;

export function ReviewCorrectionDialog({
  resultId,
  currentScores,
  currentPatternCode,
}: {
  resultId: string;
  currentScores: unknown;
  currentPatternCode: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<CorrectionFormInput>({
    resolver: zodResolver(CorrectionFormSchema),
    defaultValues: {
      patternCode: currentPatternCode,
      reason: "",
      scoresText: JSON.stringify(currentScores ?? {}, null, 2),
    },
  });
  const mutation = useApplyCorrection(resultId, () => {
    setOpen(false);
    router.refresh();
  });

  const submit = form.handleSubmit(
    (values) => {
      let scores: Record<string, unknown>;
      try {
        const parsed: unknown = JSON.parse(values.scoresText);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          form.setError("scoresText", { message: "Skor harus objek JSON." });
          return;
        }
        scores = parsed as Record<string, unknown>;
      } catch {
        form.setError("scoresText", { message: "JSON tidak valid." });
        return;
      }
      mutation.mutate({ patternCode: values.patternCode, reason: values.reason, scores });
    },
    () => toast.error(FORM_INVALID_TOAST),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11">
          <PencilLine className="size-4" aria-hidden />
          Koreksi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Koreksi skor</DialogTitle>
          <DialogDescription>
            Skor asli tidak berubah — koreksi tersimpan terpisah sebagai versi psikolog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <Field data-invalid={Boolean(form.formState.errors.patternCode)}>
            <FieldLabel htmlFor="correction-pattern">Kode pola</FieldLabel>
            <Input
              {...form.register("patternCode")}
              id="correction-pattern"
              disabled={mutation.isPending}
              className="h-11"
            />
            {form.formState.errors.patternCode && (
              <FieldError>{form.formState.errors.patternCode.message}</FieldError>
            )}
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.scoresText)}>
            <FieldLabel htmlFor="correction-scores">Skor (JSON)</FieldLabel>
            <Textarea
              {...form.register("scoresText")}
              id="correction-scores"
              rows={6}
              className="font-mono text-xs"
              disabled={mutation.isPending}
            />
            {form.formState.errors.scoresText && (
              <FieldError>{form.formState.errors.scoresText.message}</FieldError>
            )}
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.reason)}>
            <FieldLabel htmlFor="correction-reason">Alasan (min. 10 karakter)</FieldLabel>
            <Textarea
              {...form.register("reason")}
              id="correction-reason"
              rows={2}
              disabled={mutation.isPending}
            />
            {form.formState.errors.reason && (
              <FieldError>{form.formState.errors.reason.message}</FieldError>
            )}
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan Koreksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
