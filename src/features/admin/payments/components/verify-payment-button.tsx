"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { verifyPayment } from "../api";

export function VerifyPaymentButton({ payment }: { payment: AdminPaymentListItem }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await verifyPayment(payment.orderId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.payments.all });
      toast.success(
        result.wasLate
          ? `Terverifikasi (terlambat) — sesi & attempt dibuat.`
          : `Terverifikasi — sesi & attempt dibuat.`,
      );
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={mutation.isPending}>
          <Check className="size-4" aria-hidden />
          Verifikasi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Verifikasi pembayaran {payment.amount.toLocaleString("id-ID")}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Kode unik {String(payment.uniqueCode).padStart(3, "0")} atas nama {payment.userName}.
            Sesi individual dan attempt akan dibuat tepat satu kali untuk peserta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>Verifikasi</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
