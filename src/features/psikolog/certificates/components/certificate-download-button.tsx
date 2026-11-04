"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadCertificatePdf } from "../hooks/use-certificate-document";

/** ACTIVE certificates only — the backend answers 409 for anything else. */
export function CertificateDownloadButton({
  id,
  number,
}: {
  id: string;
  number: string | null;
}) {
  const download = useDownloadCertificatePdf();

  return (
    <Button
      variant="outline"
      disabled={download.isPending}
      onClick={() => download.mutate({ id, number })}
    >
      <Download className="size-4" aria-hidden />
      {download.isPending ? "Menyiapkan..." : "Unduh PDF"}
    </Button>
  );
}
