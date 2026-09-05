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
import { useCloseSession } from "../hooks/use-session-mutations";

export function CloseSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const mutation = useCloseSession(() => router.refresh());

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={mutation.isPending}>
          {mutation.isPending ? "Menutup..." : "Tutup Sesi"}
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
          <AlertDialogAction onClick={() => mutation.mutate(sessionId)}>
            Ya, tutup
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
