"use client";

import { useState } from "react";
import type { QueryKey } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { AdminArticleListItem } from "@/lib/api/types";
import {
  useDeleteArticle,
  usePublishArticle,
  useUnpublishArticle,
} from "../hooks/use-article-mutations";
import { ArticleFormDialog } from "./article-form-dialog";

interface ArticleRowActionsProps {
  row: AdminArticleListItem;
  listKey: QueryKey;
}

/** Edit / publish-toggle / delete for one article row. */
export function ArticleRowActions({ row, listKey }: ArticleRowActionsProps) {
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
