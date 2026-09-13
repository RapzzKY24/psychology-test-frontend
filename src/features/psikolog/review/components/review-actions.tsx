"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, Copy, Undo2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { FORM_INVALID_TOAST } from "@/features/admin/copy";
import {
  useApproveReview,
  useReturnReview,
} from "../hooks/use-review-actions";
import { ReturnReviewSchema } from "../schemas";
import type { ReturnReviewInput } from "../schemas";

export function ApproveButton({ resultId }: { resultId: string }) {
  const router = useRouter();
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mutation = useApproveReview(resultId, (code) => {
    setVerifyCode(code);
    router.refresh();
  });

  return (
    <Dialog
      open={verifyCode !== null}
      onOpenChange={(open) => {
        if (!open) setVerifyCode(null);
      }}
    >
      <Button
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        className="h-11"
      >
        <Check className="size-4" aria-hidden />
        {mutation.isPending ? "Memproses..." : "Setujui Hasil"}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hasil disetujui</DialogTitle>
          <DialogDescription>
            Kode verifikasi publik — salin untuk dokumen hasil.
          </DialogDescription>
        </DialogHeader>
        {verifyCode && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
            <code className="min-w-0 flex-1 truncate font-mono text-sm">{verifyCode}</code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Salin kode"
              onClick={() => {
                void navigator.clipboard.writeText(verifyCode).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ReturnDialog({ resultId }: { resultId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<ReturnReviewInput>({
    resolver: zodResolver(ReturnReviewSchema),
    defaultValues: { reason: "" },
  });
  const mutation = useReturnReview(resultId, () => {
    form.reset();
    setOpen(false);
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11">
          <Undo2 className="size-4" aria-hidden />
          Kembalikan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kembalikan hasil</DialogTitle>
          <DialogDescription>
            Tulis alasan pengembalian (minimal 10 karakter).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(
            (values) => mutation.mutate(values),
            () => toast.error(FORM_INVALID_TOAST),
          )}
          noValidate
          className="grid gap-4"
        >
          <Field data-invalid={Boolean(form.formState.errors.reason)}>
            <FieldLabel htmlFor="return-reason">Alasan</FieldLabel>
            <Textarea
              {...form.register("reason")}
              id="return-reason"
              rows={3}
              disabled={mutation.isPending}
            />
            {form.formState.errors.reason && (
              <FieldError>{form.formState.errors.reason.message}</FieldError>
            )}
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Memproses..." : "Kembalikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
