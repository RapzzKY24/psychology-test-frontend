"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { QueryKey } from "@tanstack/react-query";
import type { Institution } from "@/lib/api/types";
import { useCreateSessionForm } from "../hooks/use-create-session-form";
import { CreateSessionFields } from "./create-session-fields";

interface CreateSessionDialogProps {
  /** List cache key — the mutation prepends the new session optimistically. */
  listKey: QueryKey;
  /** PUBLISHED tests for the multiselect (fetched server-side). */
  tests: Array<{ id: string; name: string }>;
  /** Institutions for the optional Select (fetched server-side, RSC props). */
  institutions: Institution[];
}

export function CreateSessionDialog({ listKey, tests, institutions }: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false);

  const { form, mutation, submit } = useCreateSessionForm(listKey, () => {
    // Close on success — the grayed new row (with its Salin Undangan button)
    // is already visible in the table behind the dialog.
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Sesi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Sesi</DialogTitle>
          <DialogDescription>
            Sesi group: bagikan tautan undangan, peserta masuk tanpa akun.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={submit} noValidate className="grid gap-4">
            <CreateSessionFields
              tests={tests}
              institutions={institutions}
              disabled={mutation.isPending}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Buat Sesi"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
