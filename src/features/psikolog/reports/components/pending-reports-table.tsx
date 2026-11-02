import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { ReportCandidate } from "@/lib/api/types";

interface PendingReportsTableProps {
  rows: ReportCandidate[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

/** Participants whose tests are all approved but who have no report yet. */
export function PendingReportsTable({ rows, meta, pageHref }: PendingReportsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Tidak ada peserta yang menunggu laporan"
        description="Peserta muncul di sini setelah semua tesnya disetujui psikolog."
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
              <TableHead>Sesi</TableHead>
              <TableHead>Tes disetujui</TableHead>
              <TableHead className="w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.participantId}>
                <TableCell className="font-medium">{row.participantName}</TableCell>
                <TableCell className="text-muted-foreground">{row.sessionTitle}</TableCell>
                <TableCell className="tabular-nums">
                  {row.testsApproved}/{row.testsTotal}
                </TableCell>
                <TableCell>
                  <Button size="sm" asChild>
                    <Link href={`/psikolog/laporan/${row.participantId}`}>Buat Laporan</Link>
                  </Button>
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
