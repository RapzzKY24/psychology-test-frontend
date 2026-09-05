"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
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
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { cancelPayment } from "../api";
import { CancelPaymentSchema } from "../schemas";
import type { CancelPaymentInput } from "../schemas";

export function CancelPaymentDialog({ payment }: { payment: AdminPaymentListItem }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CancelPaymentInput>({
    resolver: zodResolver(CancelPaymentSchema),
    defaultValues: { reason: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: CancelPaymentInput) => {
      const { data } = await cancelPayment(payment.orderId, values.reason);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.payments.all });
      toast.success(`Pesanan dibatalkan.`);
      setOpen(false);
    },
    onError: (error) => {
      setFormError(
        isApiError(error)
          ? error.message
          : GENERIC_ERROR_MESSAGE,
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setFormError(null);
        if (next) form.reset({ reason: "" });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          <XCircle className="size-4" aria-hidden />
          Batalkan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Batalkan pesanan?</DialogTitle>
          <DialogDescription>
            Nominal {payment.amount.toLocaleString("id-ID")} — {payment.userEmail}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutateAsync(values))}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="reason"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`cancel-${payment.orderId}`}>Alasan</FieldLabel>
                <Textarea
                  {...field}
                  id={`cancel-${payment.orderId}`}
                  rows={3}
                  placeholder="Contoh: Tidak ada mutasi masuk setelah 3 hari."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                {formError && (
                  <p role="alert" className="text-sm text-destructive">
                    {formError}
                  </p>
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Batalkan Pesanan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
