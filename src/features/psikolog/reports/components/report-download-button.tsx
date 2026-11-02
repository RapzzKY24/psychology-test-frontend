"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadReportPdf } from "../hooks/use-download-report-pdf";

export function ReportDownloadButton({
  id,
  number,
  label = "Unduh PDF",
}: {
  id: string;
  number: string | null;
  label?: string;
}) {
  const mutation = useDownloadReportPdf();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id, number })}
    >
      <Download className="size-3.5" aria-hidden />
      {mutation.isPending ? "Menyiapkan..." : label}
    </Button>
  );
}
