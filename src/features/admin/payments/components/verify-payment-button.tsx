"use client";

import { Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/format/format-idr";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { useVerifyPayment } from "../hooks/use-verify-payment";

export function VerifyPaymentButton({ payment }: { payment: AdminPaymentListItem }) {
  const mutation = useVerifyPayment(payment, () => {});

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
            Verifikasi pembayaran {formatIdr(payment.amount)}?
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
