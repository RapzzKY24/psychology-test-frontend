"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/client";
import { downloadFile } from "@/lib/download";

/**
 * ACTIVE certificates only — the backend answers 409 for anything else, and
 * the card never renders this button for a revoked row.
 */
export function CertificateDownloadButton({ id, number }: { id: string; number: string }) {
  const [pending, setPending] = useState(false);
  const fallback = `sertifikat-${number.replace(/\//g, "-")}.pdf`;

  async function handleDownload() {
    setPending(true);
    try {
      await downloadFile(`/me/certificates/${encodeURIComponent(id)}/pdf`, fallback);
    } catch (error) {
      toast.error(isApiError(error) ? error.message : "Sertifikat gagal diunduh.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" disabled={pending} onClick={handleDownload}>
      <Download className="size-4" aria-hidden />
      {pending ? "Menyiapkan..." : "Unduh PDF"}
    </Button>
  );
}
