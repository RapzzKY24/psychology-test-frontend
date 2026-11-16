import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MeCertificateItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { CertificateDownloadButton } from "./certificate-download-button";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * One issued certificate. A revoked row keeps its number and verification
 * page — the paper may still be out there — but loses the download button.
 */
export function SertifikatCard({ certificate }: { certificate: MeCertificateItem }) {
  const revoked = certificate.status === "REVOKED";

  return (
    <article className="flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Award className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug">{certificate.testName}</h2>
          <p className="mt-0.5 font-mono text-sm text-muted-foreground">{certificate.number}</p>
        </div>
        <Badge variant={revoked ? "destructive" : "default"}>{revoked ? "Dicabut" : "Aktif"}</Badge>
      </div>

      <dl className="space-y-1 text-sm">
        <MetaRow label="Terbit" value={formatIdDate(certificate.issuedAt)} />
        {certificate.validUntil && (
          <MetaRow label="Berlaku sampai" value={formatIdDate(certificate.validUntil)} />
        )}
      </dl>

      {revoked && (
        <p className="text-sm text-destructive">
          Sertifikat ini sudah dicabut dan tidak bisa diunduh lagi.
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        {!revoked && <CertificateDownloadButton id={certificate.id} number={certificate.number} />}
        {certificate.verifyCode && (
          <Button variant="outline" asChild>
            <Link
              href={`/verifikasi-sertifikat/${certificate.verifyCode}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-4" aria-hidden />
              Halaman verifikasi
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
