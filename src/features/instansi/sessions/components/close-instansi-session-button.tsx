"use client";

import { useRouter } from "next/navigation";
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
import type { QueryKey } from "@tanstack/react-query";
import { useCloseInstansiSession } from "../hooks/use-instansi-session-mutations";

export function CloseInstansiSessionButton({
  sessionId,
  listKey,
}: {
  sessionId: string;
  /** Only needed when a rendered list shares this key (optimistic patch). */
  listKey?: QueryKey;
}) {
  const router = useRouter();
  const mutation = useCloseInstansiSession(sessionId, () => router.refresh(), listKey);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Menutup..." : "Tutup"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tutup sesi ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Peserta baru tidak bisa lagi join. Attempt yang sedang berjalan masih punya masa
            tenggang 24 jam untuk menyelesaikan tes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>Ya, tutup</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
