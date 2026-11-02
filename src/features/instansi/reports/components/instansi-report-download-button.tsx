"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadInstansiReportPdf } from "../hooks/use-download-instansi-report-pdf";

export function InstansiReportDownloadButton({
  id,
  number,
}: {
  id: string;
  number: string | null;
}) {
  const mutation = useDownloadInstansiReportPdf();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id, number })}
    >
      <Download className="size-3.5" aria-hidden />
      {mutation.isPending ? "Menyiapkan..." : "Unduh PDF"}
    </Button>
  );
}
