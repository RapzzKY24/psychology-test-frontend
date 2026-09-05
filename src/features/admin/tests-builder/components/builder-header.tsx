"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Rocket, Save } from "lucide-react";
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
import { SettingsModal } from "./settings-modal";
import { TestStatusBadge } from "./status-badge";
import type { BuilderController } from "../hooks/use-builder-form";
import type { AdminTest, AdminTestDetail } from "@/lib/api/types";

interface BuilderHeaderProps {
  detail: AdminTestDetail;
  displayName: string;
  builder: BuilderController;
  onSettingsSaved: (updated: AdminTest) => void;
}

export function BuilderHeader({ detail, displayName, builder, onSettingsSaved }: BuilderHeaderProps) {
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
          <h2 className="truncate text-base font-semibold">{displayName}</h2>
          <TestStatusBadge status={detail.status} />
          <SettingsModal detail={detail} locked={builder.locked} onSaved={onSettingsSaved}>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label="Edit pengaturan tes"
            >
              <Pencil className="size-3.5" aria-hidden />
            </Button>
          </SettingsModal>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {detail.status === "DRAFT" && (
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
        {detail.status === "DRAFT" && (
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
