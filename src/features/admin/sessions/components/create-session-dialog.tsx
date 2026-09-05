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
import type { Institution, SessionSummary } from "@/lib/api/types";
import { useCreateSessionForm } from "../hooks/use-create-session-form";
import { CreateSessionFields } from "./create-session-fields";
import { CreateSessionSuccess } from "./create-session-success";

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
  const [created, setCreated] = useState<SessionSummary | null>(null);

  const { form, mutation, submit } = useCreateSessionForm(listKey, (createdSession) => {
    setCreated(createdSession);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setCreated(null);
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

        {created ? (
          <CreateSessionSuccess
            created={created}
            onDone={() => {
              setOpen(false);
              form.reset();
            }}
          />
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
