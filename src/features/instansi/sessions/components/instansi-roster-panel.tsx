"use client";

import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionParticipantRow, SessionStatus } from "@/lib/api/types";
import { useEmployeeOptions } from "../hooks/use-employee-options";
import { useInstansiRosterMutations } from "../hooks/use-instansi-roster-mutations";
import { EmployeePickerDialog } from "./employee-picker-dialog";
import { RosterParticipantRow } from "./roster-participant-row";

interface InstansiRosterPanelProps {
  sessionId: string;
  participants: SessionParticipantRow[];
  slotLimit: number;
  /** Roster edits need a paid batch (owner decision #2, amended 2026-10-26). */
  status: SessionStatus;
}

/** Roster list with add/swap/remove + per-seat reset, editable once paid. */
export function InstansiRosterPanel({
  sessionId,
  participants,
  slotLimit,
  status,
}: InstansiRosterPanelProps) {
  const mutations = useInstansiRosterMutations(sessionId);
  const [addOpen, setAddOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<SessionParticipantRow | null>(null);

  const employeesQuery = useEmployeeOptions(addOpen || swapTarget !== null);

  const linkedIds = participants.map((p) => p.employeeId).filter((id): id is string => id !== null);
  const isFull = participants.length >= slotLimit;
  const canEdit = status !== "PENDING_PAYMENT";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4" aria-hidden />
          Daftar Peserta ({participants.length}/{slotLimit})
        </CardTitle>
        <Button size="sm" disabled={!canEdit || isFull} onClick={() => setAddOpen(true)}>
          <UserPlus className="size-4" aria-hidden />
          Tambah peserta
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!canEdit && (
          <p className="text-muted-foreground rounded-lg border border-dashed p-3 text-sm">
            Sesi belum dibayar. Daftar peserta bisa diubah setelah pembayaran diterima.
          </p>
        )}

        {participants.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {canEdit
              ? "Belum ada peserta. Tambahkan dari daftar pegawai instansi."
              : "Pembayaran belum diterima — peserta bisa ditambahkan setelah sesi aktif."}
          </p>
        ) : (
          <ul className="divide-y">
            {participants.map((participant) => (
              <RosterParticipantRow
                key={participant.id}
                participant={participant}
                canEdit={canEdit}
                resetPending={mutations.reset.isPending}
                removePending={mutations.remove.isPending}
                onSwap={() => setSwapTarget(participant)}
                onReset={() => mutations.reset.mutate(participant.id)}
                onRemove={() => mutations.remove.mutate(participant.id)}
              />
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
