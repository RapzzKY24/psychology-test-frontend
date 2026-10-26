"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { createInstansiSession } from "../api";
import type { InstansiTestOption } from "../api";
import { computeBatchAmount } from "../compute-batch-amount";
import { CreateBatchSchema, type CreateBatchInput } from "../schemas";

/**
 * Checkout logic for one catalog test: the test is fixed by the URL, so the
 * form only owns the slot count and the prepaid total (price × slots).
 */
export function useSingleTestCheckout(test: InstansiTestOption) {
  const router = useRouter();

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(CreateBatchSchema),
    // The institution decides the seat count — no prefilled number.
    defaultValues: { testIds: [test.id], slotLimit: undefined },
  });

  const slots = Math.max(0, Math.trunc(form.watch("slotLimit")) || 0);
  const totalAmount = computeBatchAmount([test], slots);

  const mutation = useMutation({
    mutationFn: (values: CreateBatchInput) => createInstansiSession(values),
    onSuccess: ({ data }) => {
      toast.success("Sesi dibuat — lanjutkan pembayaran.");
      router.push(`/instansi/tagihan/${data.invoice.id}`);
    },
    onError: (error) => {
      if (isApiError(error) && error.isValidation) {
        if (error.details?.some((detail) => detail.startsWith("slotLimit"))) {
          form.setError("slotLimit", { message: "Jumlah peserta tidak valid." });
          return;
        }
        if (error.details?.some((detail) => detail.includes("price"))) {
          toast.error("Harga tes ini belum diset — hubungi admin.");
          return;
        }
      }
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });

  const submit = form.handleSubmit((values) => mutation.mutate({ ...values, testIds: [test.id] }));

  return {
    form,
    submit,
    slots,
    totalAmount,
    isSubmitting: mutation.isPending,
    canSubmit: totalAmount > 0 && !mutation.isPending,
  };
}
