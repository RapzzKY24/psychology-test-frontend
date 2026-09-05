import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { AdminUser } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { ChangeRoleDialog } from "./change-role-dialog";
import { ROLE_LABEL } from "../schemas";

interface UsersTableProps {
  rows: AdminUser[];
  meta: PaginationMeta;
  currentUserId: string;
  role?: string;
}

export function UsersTable({ rows, meta, currentUserId, role }: UsersTableProps) {
  if (rows.length === 0) {
    return <TableEmpty title="Belum ada pengguna" filtered={Boolean(role)} />;
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (role) p.set("role", role);
    return `/admin/users?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="w-28">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </TableCell>
                <TableCell>{ROLE_LABEL[row.role]}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.createdAt)}</TableCell>
                <TableCell>
                  <ChangeRoleDialog user={row} disabled={row.id === currentUserId} />
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
