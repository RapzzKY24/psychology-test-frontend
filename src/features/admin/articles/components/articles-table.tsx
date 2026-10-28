"use client";

import type { QueryKey } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { SavingChip } from "@/components/admin/saving-chip";
import { formatIdDate } from "@/lib/format/format-date";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { OptimisticRow } from "@/lib/hooks/use-optimistic-list";
import type { AdminArticleListItem } from "@/lib/api/types";
import { ArticleRowActions } from "./article-row-actions";

interface ArticlesTableProps {
  rows: OptimisticRow<AdminArticleListItem>[];
  meta: PaginationMeta;
  listKey: QueryKey;
}

export function ArticlesTable({ rows, meta, listKey }: ArticlesTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada artikel"
        description="Tulis artikel pertama untuk halaman publik."
      />
    );
  }

  const pageHref = (next: number) => `/admin/artikel?page=${next}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Artikel</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terbit</TableHead>
              <TableHead className="w-52">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={cn(row._optimistic && "opacity-60")}>
                <TableCell>
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">/artikel/{row.slug}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.category ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      row.status === "PUBLISHED"
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-transparent bg-muted text-muted-foreground"
                    }
                  >
                    {row.status === "PUBLISHED" ? "Terbit" : "Draf"}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatIdDate(row.publishedAt ?? row.createdAt)}
                </TableCell>
                <TableCell>
                  {row._optimistic ? (
                    <SavingChip />
                  ) : (
                    <ArticleRowActions row={row} listKey={listKey} />
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
