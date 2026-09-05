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
import type { Institution } from "@/lib/api/types";
import { InstitutionFormDialog } from "./institution-form-dialog";

interface InstitutionsTableProps {
  rows: Institution[];
  meta: PaginationMeta;
}

export function InstitutionsTable({ rows, meta }: InstitutionsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada institusi"
        description="Institusi adalah klien B2B pemilik sesi group dan invoice."
      />
    );
  }

  const pageHref = (next: number) => `/admin/institusi?page=${next}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Institusi</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead className="w-16">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium">{row.name}</p>
                  {row.notes && <p className="text-xs text-muted-foreground">{row.notes}</p>}
                </TableCell>
                <TableCell>
                  <p>{row.contactName}</p>
                  <p className="text-xs text-muted-foreground">{row.contactEmail}</p>
                </TableCell>
                <TableCell className="tabular-nums">{row.phone || "—"}</TableCell>
                <TableCell>
                  <InstitutionFormDialog mode="edit" institution={row} />
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
