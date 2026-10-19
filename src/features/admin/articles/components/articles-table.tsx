"use client";

import { useState } from "react";
import type { QueryKey } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { SavingChip } from "@/components/admin/saving-chip";
import { formatIdDate } from "@/lib/format/format-date";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { OptimisticRow } from "@/features/admin/hooks/use-optimistic-list";
import type { AdminArticleListItem } from "@/lib/api/types";
import {
  useDeleteArticle,
  usePublishArticle,
  useUnpublishArticle,
} from "../hooks/use-article-mutations";
import { ArticleFormDialog } from "./article-form-dialog";

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

function ArticleRowActions({
  row,
  listKey,
}: {
  row: AdminArticleListItem;
  listKey: QueryKey;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const publish = usePublishArticle(listKey, row.id);
  const unpublish = useUnpublishArticle(listKey, row.id);
  const remove = useDeleteArticle(listKey, row.id);
  const statusMutation = row.status === "PUBLISHED" ? unpublish : publish;

  return (
    <div className="flex items-center gap-2">
      <ArticleFormDialog
        mode="edit"
        listKey={listKey}
        article={row}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" aria-hidden />
            Edit
          </Button>
        }
      />
      <Button
        variant="outline"
        size="sm"
        disabled={statusMutation.isPending}
        onClick={() => statusMutation.mutate()}
      >
        {row.status === "PUBLISHED" ? "Tarik" : "Terbitkan"}
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Hapus ${row.title}`}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-4 text-destructive" aria-hidden />
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{row.title}&rdquo; akan dihapus permanen, termasuk gambar sampulnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => remove.mutate()}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
