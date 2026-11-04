"use client";

import { useState } from "react";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useRevokeCertificate } from "../hooks/use-certificate-mutations";

const MIN_REASON = 10;

/**
 * Cancelling is public: the QR stops asserting the verdict and starts showing
 * the reason, so the reason is required and must say something.
 */
export function CertificateRevokeDialog({ certificateId }: { certificateId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const revoke = useRevokeCertificate(certificateId);

  const valid = reason.trim().length >= MIN_REASON;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Batalkan Sertifikat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batalkan sertifikat ini?</DialogTitle>
          <DialogDescription>
            Sertifikat tidak dihapus dan nomornya tidak dipakai ulang. Siapa pun yang memindai QR
            akan melihat bahwa dokumen ini dibatalkan beserta alasannya.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="revoke-reason">Alasan pembatalan</FieldLabel>
          <Textarea
            id="revoke-reason"
            value={reason}
            maxLength={500}
            rows={3}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Misalnya: salah input tanggal lahir peserta"
          />
          <FieldDescription>Minimal {MIN_REASON} karakter.</FieldDescription>
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            disabled={!valid || revoke.isPending}
            onClick={() =>
              revoke.mutate(reason.trim(), {
                onSuccess: () => {
                  setOpen(false);
                  setReason("");
                },
              })
            }
          >
            {revoke.isPending ? "Membatalkan..." : "Ya, batalkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
