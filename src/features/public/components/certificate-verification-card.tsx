import { BadgeCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIdDate } from "@/lib/format/format-date";
import { cn } from "@/lib/utils";
import type { CertificateVerification } from "@/lib/api/types";

const VERDICT_LABEL: Record<string, string> = {
  MEMENUHI_SYARAT: "Memenuhi Syarat",
  TIDAK_MEMENUHI_SYARAT: "Tidak Memenuhi Syarat",
};

/** `YYYY-MM-DD` is a calendar day; parsing it as an instant would shift it. */
function formatDay(value: string | undefined): string {
  if (!value) return "—";
  return formatIdDate(`${value}T00:00:00`);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

/**
 * Three outcomes: not registered, cancelled, or valid. A cancelled certificate
 * never shows its verdict — the backend omits it on purpose.
 */
export function CertificateVerificationCard({
  certificate,
}: {
  certificate: CertificateVerification;
}) {
  const found = certificate.valid;
  const revoked = found && certificate.status === "REVOKED";

  const Icon = !found ? ShieldX : revoked ? ShieldAlert : BadgeCheck;
  const title = !found
    ? "Dokumen tidak ditemukan"
    : revoked
      ? "Sertifikat dibatalkan"
      : "Sertifikat tervalidasi";
  const description = !found
    ? "Kode verifikasi ini tidak terdaftar. Periksa kembali atau hubungi penerbit sertifikat."
    : revoked
      ? "Sertifikat ini sudah dibatalkan penerbitnya dan tidak berlaku."
      : "Sertifikat ini diterbitkan melalui sistem mypsikolog.id.";

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div
        className={cn(
          "flex items-start gap-3 border-b px-6 py-5",
          !found || revoked ? "bg-destructive/5" : "bg-muted/40",
        )}
      >
        <Icon
          className={cn(
            "mt-0.5 size-5 shrink-0",
            !found || revoked ? "text-destructive" : "text-primary",
          )}
          aria-hidden
        />
        <div className="space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {found && (
        <dl className="divide-y px-6 py-3">
          <Row label="Nomor Sertifikat" value={certificate.number ?? "—"} />
          <Row label="Nama" value={certificate.holderName ?? "—"} />
          <Row label="Tes" value={certificate.testName ?? "—"} />
          <div className="flex items-center justify-between gap-6 py-2.5">
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd>
              <Badge variant={revoked ? "destructive" : "default"}>
                {revoked ? "Dibatalkan" : "Terbit"}
              </Badge>
            </dd>
          </div>
          {certificate.revision && certificate.revision > 1 ? (
            <Row label="Revisi" value={`ke-${certificate.revision}`} />
          ) : null}
          {!revoked && certificate.verdict ? (
            <Row label="Hasil" value={VERDICT_LABEL[certificate.verdict] ?? certificate.verdict} />
          ) : null}
          {!revoked ? (
            <Row label="Berlaku Sampai" value={formatDay(certificate.validUntil)} />
          ) : null}
          <Row label="Tanggal Terbit" value={formatIdDate(certificate.issuedAt)} />
          <Row
            label="Diterbitkan Oleh"
            value={
              certificate.issuerName
                ? `${certificate.issuerName}${certificate.issuerSipp ? ` · SIPP ${certificate.issuerSipp}` : ""}`
                : "—"
            }
          />
          {revoked ? (
            <>
              <Row label="Dibatalkan Pada" value={formatIdDate(certificate.revokedAt)} />
              <Row label="Alasan" value={certificate.revokeReason ?? "—"} />
            </>
          ) : null}
        </dl>
      )}

      <div className="border-t bg-muted/40 px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          {found
            ? "Cocokkan nomor sertifikat di atas dengan dokumen yang Anda pegang."
            : "Dokumen dengan kode ini tidak pernah diterbitkan sistem kami."}
        </p>
      </div>
    </div>
  );
}
