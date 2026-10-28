"use client";

import { Pencil, RotateCcw, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionParticipantRow } from "@/lib/api/types";

interface RosterParticipantRowProps {
  participant: SessionParticipantRow;
  canEdit: boolean;
  resetPending: boolean;
  removePending: boolean;
  onSwap: () => void;
  onReset: () => void;
  onRemove: () => void;
}

/** One seat: name, claim state, and the swap/reset/remove actions. */
export function RosterParticipantRow({
  participant,
  canEdit,
  resetPending,
  removePending,
  onSwap,
  onReset,
  onRemove,
}: RosterParticipantRowProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{participant.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant={participant.claimed ? "default" : "secondary"}>
            {participant.claimed ? "Terkunci" : "Belum diklaim"}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {participant.answeredCount} jawaban
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled={!canEdit} onClick={onSwap}>
          <Pencil className="size-4" aria-hidden />
          <span className="sr-only">Ganti</span>
        </Button>

        {participant.claimed && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={!canEdit || resetPending}>
                <RotateCcw className="size-4" aria-hidden />
                <span className="sr-only">Reset akses</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset akses {participant.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seat dibuka kembali dan bisa diklaim di HP lain. Jawaban yang sudah tersimpan
                  tidak dihapus.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>Ya, reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={!canEdit || removePending}>
              <Trash2 className="size-4" aria-hidden />
              <span className="sr-only">Hapus</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus {participant.name} dari sesi?</AlertDialogTitle>
              <AlertDialogDescription>
                Seat ini dikosongkan dan bisa diisi pegawai lain. Jumlah tagihan tidak berubah
                karena slot sudah dibayar di muka.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Ya, hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
