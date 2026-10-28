"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NotebookPen } from "lucide-react";
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
import { FORM_INVALID_TOAST } from "@/lib/copy";
import { useSaveReviewNotes } from "../hooks/use-review-actions";
import { ReviewNotesSchema } from "../schemas";
import type { ReviewNotesInput } from "../schemas";

export function ReviewNotesDialog({
  resultId,
  initialNotes,
}: {
  resultId: string;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<ReviewNotesInput>({
    resolver: zodResolver(ReviewNotesSchema),
    defaultValues: { notes: initialNotes ?? "" },
  });
  const mutation = useSaveReviewNotes(resultId, () => {
    setOpen(false);
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11">
          <NotebookPen className="size-4" aria-hidden />
          Catatan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catatan peninjauan</DialogTitle>
          <DialogDescription>Catatan internal, tidak terlihat peserta.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(
            (values) => mutation.mutate(values),
            () => toast.error(FORM_INVALID_TOAST),
          )}
          noValidate
          className="grid gap-4"
        >
          <Field data-invalid={Boolean(form.formState.errors.notes)}>
            <FieldLabel htmlFor="review-notes">Catatan</FieldLabel>
            <Textarea
              {...form.register("notes")}
              id="review-notes"
              rows={4}
              disabled={mutation.isPending}
            />
            {form.formState.errors.notes && (
              <FieldError>{form.formState.errors.notes.message}</FieldError>
            )}
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan Catatan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
