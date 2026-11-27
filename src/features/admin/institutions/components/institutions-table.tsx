import { Tag } from "lucide-react";
import Link from "next/link";
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
import type { OptimisticRow } from "@/lib/hooks/use-optimistic-list";
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
              <TableHead className="w-44">Aksi</TableHead>
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
                  {row._optimistic ? (
                    <SavingChip />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/institusi/${row.id}`}
                        className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                      >
                        <Tag className="size-3.5" aria-hidden />
                        Harga Khusus
                      </Link>
                      <InstitutionFormDialog
                        listKey={listKey}
                        mode="edit"
                        institution={row}
                      />
                    </div>
                  )}
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
