import { BadgeCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIdDate } from "@/lib/format/format-date";
import { cn } from "@/lib/utils";
import type { ReportVerification } from "@/lib/api/types";

const RECOMMENDATION_LABEL: Record<string, string> = {
  LAYAK: "Layak",
  BELUM_LAYAK: "Belum Layak",
  TIDAK_LAYAK: "Tidak Layak",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

/**
 * Three outcomes: not registered, cancelled, or valid. A cancelled document
 * never shows its recommendation — the backend omits it on purpose.
 */
export function ReportVerificationCard({ report }: { report: ReportVerification }) {
  const found = report.valid;
  const revoked = found && report.status === "REVOKED";

  const Icon = !found ? ShieldX : revoked ? ShieldAlert : BadgeCheck;
  const title = !found
    ? "Dokumen tidak ditemukan"
    : revoked
      ? "Dokumen dibatalkan"
      : "Dokumen tervalidasi";
  const description = !found
    ? "Kode verifikasi ini tidak terdaftar. Periksa kembali atau hubungi penerbit laporan."
    : revoked
      ? "Laporan ini sudah dibatalkan penerbitnya dan tidak berlaku."
      : "Laporan ini diterbitkan melalui sistem mypsikolog.id.";

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
          <Row label="Nomor Laporan" value={report.number ?? "—"} />
          <Row label="Nama Peserta" value={report.holderName ?? "—"} />
          <Row label="Sesi" value={report.sessionTitle ?? "—"} />
          <Row label="Tanggal Terbit" value={formatIdDate(report.issuedAt)} />
          {report.revision && report.revision > 1 ? (
            <Row label="Revisi" value={`ke-${report.revision}`} />
          ) : null}
          <div className="flex items-center justify-between gap-6 py-2.5">
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd>
              <Badge variant={revoked ? "destructive" : "default"}>
                {revoked ? "Dibatalkan" : "Terbit"}
              </Badge>
            </dd>
          </div>
          {!revoked && report.recommendation ? (
            <Row
              label="Rekomendasi"
              value={RECOMMENDATION_LABEL[report.recommendation] ?? report.recommendation}
            />
          ) : null}
          {revoked ? (
            <>
              <Row label="Dibatalkan Pada" value={formatIdDate(report.revokedAt)} />
              <Row label="Alasan" value={report.revokeReason ?? "—"} />
            </>
          ) : null}
        </dl>
      )}

      <div className="border-t bg-muted/40 px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          {found
            ? "Cocokkan nomor laporan di atas dengan dokumen yang Anda pegang."
            : "Dokumen dengan kode ini tidak pernah diterbitkan sistem kami."}
        </p>
      </div>
    </div>
  );
}
