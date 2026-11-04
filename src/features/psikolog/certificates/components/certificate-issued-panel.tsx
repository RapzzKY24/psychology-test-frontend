"use client";

import Link from "next/link";
import { Ban, CheckCircle2, FilePenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { CertificateRecord } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { useCreateCertificateRevision } from "../hooks/use-certificate-mutations";
import { CertificateDownloadButton } from "./certificate-download-button";
import { CertificateRevokeDialog } from "./certificate-revoke-dialog";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * An issued certificate is frozen. The only two moves left are a correction
 * (a new revision under the same number) and, for the signer, a cancellation.
 */
export function CertificateIssuedPanel({ certificate }: { certificate: CertificateRecord }) {
  const revision = useCreateCertificateRevision(certificate.id);
  const revoked = certificate.status === "REVOKED";

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <div className="flex items-start gap-3">
        {revoked ? (
          <Ban className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        ) : (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        )}
        <div className="space-y-1">
          <h2 className="text-base font-semibold">
            {revoked ? "Sertifikat dibatalkan" : "Sertifikat sudah diterbitkan"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {revoked
              ? "Dokumen ini tidak berlaku lagi. Nomornya tetap tercatat dan tidak dipakai ulang."
              : "Dokumen ini terkunci. Koreksi dibuat sebagai revisi baru dengan nomor yang sama."}
          </p>
        </div>
        <Badge variant={revoked ? "destructive" : "default"} className="ml-auto">
          {revoked ? "Dibatalkan" : "Terbit"}
        </Badge>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Row label="Nomor sertifikat" value={certificate.number ?? "—"} />
        <Row label="Tanggal terbit" value={formatIdDate(certificate.issuedAt)} />
        <Row label="Revisi" value={`ke-${certificate.revision ?? 1}`} />
        <Row label="Kode verifikasi" value={certificate.verifyCode ?? "—"} />
      </dl>

      {revoked && (
        <dl className="grid gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 sm:grid-cols-2">
          <Row label="Dibatalkan pada" value={formatIdDate(certificate.revokedAt)} />
          <Row label="Alasan" value={certificate.revokeReason ?? "—"} />
        </dl>
      )}

      <div className="flex flex-wrap gap-2">
        {!revoked && <CertificateDownloadButton id={certificate.id} number={certificate.number} />}

        {!revoked && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={revision.isPending}>
                <FilePenLine className="size-4" aria-hidden />
                {revision.isPending ? "Membuka..." : "Buat Revisi"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Buat revisi sertifikat ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Draf baru dibuka dengan isi yang sama dan nomor yang sama. Sertifikat yang
                  sekarang tetap berlaku sampai revisinya diterbitkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => revision.mutate()}>
                  Ya, buat revisi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {!revoked && <CertificateRevokeDialog certificateId={certificate.id} />}

        <Button variant="outline" asChild>
          <Link href="/psikolog/sertifikat">Kembali ke daftar</Link>
        </Button>
      </div>
    </section>
  );
}
