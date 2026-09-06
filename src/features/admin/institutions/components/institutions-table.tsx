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
import type { OptimisticRow } from "@/features/admin/hooks/use-optimistic-list";
import type { Institution } from "@/lib/api/types";
import type { QueryKey } from "@tanstack/react-query";
import { SavingChip } from "@/components/admin/saving-chip";
import { cn } from "@/lib/utils";
import { InstitutionFormDialog } from "./institution-form-dialog";

interface InstitutionsTableProps {
  rows: OptimisticRow<Institution>[];
  listKey: QueryKey;
  meta: PaginationMeta;
}

export function InstitutionsTable({ rows, meta, listKey }: InstitutionsTableProps) {
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
              <TableRow key={row.id} className={cn(row._optimistic && "opacity-60")}>
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
                  {row._optimistic ? <SavingChip /> : <InstitutionFormDialog listKey={listKey} mode="edit" institution={row} />}
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
