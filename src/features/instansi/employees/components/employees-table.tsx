import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { SavingChip } from "@/components/admin/saving-chip";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { OptimisticRow } from "@/features/admin/hooks/use-optimistic-list";
import type { Employee } from "@/lib/api/types";
import type { QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useDeleteEmployee } from "../hooks/use-delete-employee";
import { EmployeeFormDialog } from "./employee-form-dialog";

interface EmployeesTableProps {
  rows: OptimisticRow<Employee>[];
  listKey: QueryKey;
  meta: PaginationMeta;
}

export function EmployeesTable({ rows, meta, listKey }: EmployeesTableProps) {
  const deleteMutation = useDeleteEmployee({
    listKey,
    onFailed: (message) => toast.error(message),
  });

  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada pegawai"
        description="Tambahkan data pegawai untuk dipakai sebagai roster sesi tes."
      />
    );
  }

  const pageHref = (next: number) => `/instansi/pegawai?page=${next}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pegawai</TableHead>
              <TableHead>Negara Tujuan</TableHead>
              <TableHead>Identitas</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={cn(row._optimistic && "opacity-60")}>
                <TableCell>
                  <p className="font-medium">{row.name}</p>
                  {row.notes && <p className="text-xs text-muted-foreground">{row.notes}</p>}
                </TableCell>
                <TableCell>{row.destinationCountry}</TableCell>
                <TableCell>
                  <p className="tabular-nums">{row.idNumber}</p>
                  <p className="text-xs text-muted-foreground">{row.idType}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {row._optimistic ? (
                      <SavingChip />
                    ) : (
                      <>
                        <EmployeeFormDialog listKey={listKey} mode="edit" employee={row} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              aria-label={`Hapus pegawai ${row.name}`}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus {row.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Data pegawai dihapus dari master. Kursi sesi yang sudah terisi
                                tetap tersimpan dengan nama terakhir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(row.id)}
                              >
                                Ya, hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
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
