"use client";

import { useMemo } from "react";
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
import { DEFAULT_SLOT_LIMIT } from "../constants";
import { CreateBatchSchema, type CreateBatchInput } from "../schemas";

interface UseCreateBatchFormOptions {
  tests: InstansiTestOption[];
  initialTestId?: string;
}

/**
 * Checkout logic for a prepaid batch: selection, slot count, computed total,
 * and the create mutation that redirects to the invoice page.
 */
export function useCreateBatchForm({ tests, initialTestId }: UseCreateBatchFormOptions) {
  const router = useRouter();

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(CreateBatchSchema),
    defaultValues: {
      testIds:
        initialTestId && tests.some((test) => test.id === initialTestId) ? [initialTestId] : [],
      slotLimit: DEFAULT_SLOT_LIMIT,
    },
  });

  const testIds = form.watch("testIds");
  const slotLimit = form.watch("slotLimit");

  const selectedTests = useMemo(
    () => tests.filter((test) => testIds.includes(test.id)),
    [tests, testIds],
  );
  const slots = Math.max(0, Math.trunc(slotLimit) || 0);
  const totalAmount = computeBatchAmount(selectedTests, slots);

  const mutation = useMutation({
    mutationFn: (values: CreateBatchInput) => createInstansiSession(values),
    onSuccess: ({ data }) => {
      toast.success("Sesi dibuat — lanjutkan pembayaran.");
      router.push(`/instansi/tagihan/${data.invoice.id}`);
    },
    onError: (error) => {
      if (
        isApiError(error) &&
        error.isValidation &&
        error.details?.some((detail) => detail.startsWith("slotLimit"))
      ) {
        form.setError("slotLimit", { message: error.message });
        return;
      }
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });

  const toggleTest = (testId: string) => {
    const next = testIds.includes(testId)
      ? testIds.filter((id) => id !== testId)
      : [...testIds, testId];
    form.setValue("testIds", next, { shouldValidate: true, shouldDirty: true });
  };

  const submit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    submit,
    toggleTest,
    selectedTests,
    slots,
    totalAmount,
    isSubmitting: mutation.isPending,
    canSubmit: totalAmount > 0 && !mutation.isPending,
  };
}
