import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { formatIdDate } from "@/lib/format/format-date";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { PendingCertificateResult } from "@/lib/api/types";
import { CreateCertificateButton } from "./create-certificate-button";

interface PendingCertificatesTableProps {
  rows: PendingCertificateResult[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

/**
 * Approved, non-WPT results with no certificate yet. One row per test, not per
 * participant — a certificate covers a single test.
 */
export function PendingCertificatesTable({ rows, meta, pageHref }: PendingCertificatesTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Tidak ada hasil yang menunggu sertifikat"
        description="Hasil muncul di sini setelah psikolog menyetujuinya."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Peserta</TableHead>
              <TableHead>Tes</TableHead>
              <TableHead>Sesi</TableHead>
              <TableHead>Disetujui</TableHead>
              <TableHead className="w-36">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.resultId}>
                <TableCell className="font-medium">{row.participantName ?? "—"}</TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell className="text-muted-foreground">{row.sessionTitle ?? "—"}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.approvedAt)}</TableCell>
                <TableCell>
                  <CreateCertificateButton resultId={row.resultId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
