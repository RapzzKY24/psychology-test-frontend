"use client";

import Link from "next/link";
import { ArrowLeft, Rocket, Save } from "lucide-react";
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
import { TestStatusBadge } from "./status-badge";
import type { BuilderController } from "../hooks/use-builder-form";

interface BuilderHeaderProps {
  name: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  builder: BuilderController;
}

export function BuilderHeader({ name, status, builder }: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-background/95 px-6 py-4 backdrop-blur">
      <Link
        href="/admin/tes"
        className="flex size-8 items-center justify-center rounded-md border hover:bg-muted"
        aria-label="Kembali ke daftar tes"
      >
        <ArrowLeft className="size-4" aria-hidden />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-base font-semibold">{name}</h2>
          <TestStatusBadge status={status} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === "DRAFT" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Arsipkan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Arsipkan tes ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tes yang diarsipkan tidak muncul di katalog dan tidak bisa dikerjakan. Tindakan
                  ini tidak bisa dibatalkan dari UI.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => void builder.onArchive()}>
                  Ya, arsipkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {status === "DRAFT" && (
          <Button variant="outline" size="sm" onClick={builder.onPublish} disabled={builder.saving}>
            <Rocket className="size-4" aria-hidden />
            Publish
          </Button>
        )}
        {builder.dirtyCount > 0 && (
          <Button size="sm" onClick={builder.onSave} disabled={builder.saving}>
            <Save className="size-4" aria-hidden />
            Simpan
            <span className="rounded-full bg-primary-foreground/20 px-1.5 text-xs tabular-nums">
              {builder.dirtyCount}
            </span>
          </Button>
        )}
      </div>
    </header>
  );
}
