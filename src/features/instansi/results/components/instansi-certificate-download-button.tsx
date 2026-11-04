"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadInstansiCertificatePdf } from "../hooks/use-download-instansi-certificate-pdf";

/** Read-only: institutions download the signed document, they never issue one. */
export function InstansiCertificateDownloadButton({
  id,
  number,
}: {
  id: string;
  number: string | null;
}) {
  const mutation = useDownloadInstansiCertificatePdf();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id, number })}
    >
      <Download className="size-3.5" aria-hidden />
      {mutation.isPending ? "Menyiapkan..." : "Sertifikat"}
    </Button>
  );
}
