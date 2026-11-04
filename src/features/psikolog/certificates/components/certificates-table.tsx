import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import { formatIdDate } from "@/lib/format/format-date";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { CertificateListItem, CertificateStatus } from "@/lib/api/types";

const STATUS_LABELS: Record<CertificateStatus, string> = {
  DRAFT: "Draf",
  ACTIVE: "Terbit",
  SUPERSEDED: "Diganti",
  REVOKED: "Dibatalkan",
};

const STATUS_VARIANTS: Record<CertificateStatus, "default" | "secondary" | "outline" | "destructive"> =
  {
    DRAFT: "secondary",
    ACTIVE: "default",
    SUPERSEDED: "outline",
    REVOKED: "destructive",
  };

interface CertificatesTableProps {
  rows: CertificateListItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

export function CertificatesTable({ rows, meta, pageHref }: CertificatesTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada sertifikat"
        description="Sertifikat muncul di sini setelah dibuat dari daftar hasil yang menunggu."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nomor</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Tes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terbit</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium tabular-nums">{row.number ?? "—"}</TableCell>
                <TableCell>{row.holderName || "—"}</TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[row.status]}>{STATUS_LABELS[row.status]}</Badge>
                </TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.issuedAt)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/psikolog/sertifikat/${row.id}`}>Buka</Link>
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
