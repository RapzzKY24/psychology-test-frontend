"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Read-only view of the note a psychologist left when returning a result. */
export function ReviewNoteDialog({ testName, note }: { testName: string; note: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0">
          Lihat catatan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catatan untuk {testName}</DialogTitle>
          <DialogDescription>
            Psikolog mengembalikan hasil ini untuk diproses ulang.
          </DialogDescription>
        </DialogHeader>
        <p className="whitespace-pre-line text-sm">{note}</p>
      </DialogContent>
    </Dialog>
  );
}
