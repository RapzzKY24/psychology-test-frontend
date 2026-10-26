"use client";

import { useState } from "react";
import { Pencil, RotateCcw, Trash2, UserPlus, Users } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionParticipantRow } from "@/lib/api/types";
import { useEmployeeOptions } from "../hooks/use-employee-options";
import { useInstansiRosterMutations } from "../hooks/use-instansi-roster-mutations";
import { EmployeePickerDialog } from "./employee-picker-dialog";

interface InstansiRosterPanelProps {
  sessionId: string;
  participants: SessionParticipantRow[];
  slotLimit: number;
}

/** Roster list with add/swap/remove + per-seat reset. Free to edit anytime. */
export function InstansiRosterPanel({
  sessionId,
  participants,
  slotLimit,
}: InstansiRosterPanelProps) {
  const mutations = useInstansiRosterMutations(sessionId);
  const [addOpen, setAddOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<SessionParticipantRow | null>(null);

  const employeesQuery = useEmployeeOptions(addOpen || swapTarget !== null);

  const linkedIds = participants.map((p) => p.employeeId).filter((id): id is string => id !== null);
  const isFull = participants.length >= slotLimit;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4" aria-hidden />
          Daftar Peserta ({participants.length}/{slotLimit})
        </CardTitle>
        <Button size="sm" disabled={isFull} onClick={() => setAddOpen(true)}>
          <UserPlus className="size-4" aria-hidden />
          Tambah
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {participants.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Belum ada peserta. Tambahkan dari daftar pegawai instansi.
          </p>
        ) : (
          <ul className="divide-y">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
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
                  <Button variant="ghost" size="sm" onClick={() => setSwapTarget(participant)}>
                    <Pencil className="size-4" aria-hidden />
                    <span className="sr-only">Ganti</span>
                  </Button>

                  {participant.claimed && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={mutations.reset.isPending}>
                          <RotateCcw className="size-4" aria-hidden />
                          <span className="sr-only">Reset akses</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset akses {participant.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Seat dibuka kembali dan bisa diklaim di HP lain. Jawaban yang sudah
                            tersimpan tidak dihapus.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => mutations.reset.mutate(participant.id)}>
                            Ya, reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={mutations.remove.isPending}>
                        <Trash2 className="size-4" aria-hidden />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus {participant.name} dari sesi?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Seat ini dikosongkan dan bisa diisi pegawai lain. Jumlah tagihan tidak
                          berubah karena slot sudah dibayar di muka.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => mutations.remove.mutate(participant.id)}>
                          Ya, hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <EmployeePickerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Tambah peserta"
        description="Pilih pegawai untuk mengisi slot pada sesi ini."
        employees={employeesQuery.data ?? []}
        isLoading={employeesQuery.isLoading}
        excludeIds={linkedIds}
        mode="multi"
        confirmLabel="Tambahkan"
        pending={mutations.add.isPending}
        onSubmit={(ids) => mutations.add.mutate(ids, { onSuccess: () => setAddOpen(false) })}
      />

      <EmployeePickerDialog
        open={swapTarget !== null}
        onOpenChange={(open) => !open && setSwapTarget(null)}
        title={`Ganti ${swapTarget?.name ?? "peserta"}`}
        description="Pilih pegawai pengganti untuk seat ini."
        employees={employeesQuery.data ?? []}
        isLoading={employeesQuery.isLoading}
        excludeIds={linkedIds}
        mode="single"
        confirmLabel="Ganti"
        pending={mutations.swap.isPending}
        onSubmit={(ids) => {
          if (!swapTarget || ids.length === 0) return;
          mutations.swap.mutate(
            { participantId: swapTarget.id, employeeId: ids[0] },
            { onSuccess: () => setSwapTarget(null) },
          );
        }}
      />
    </Card>
  );
}
