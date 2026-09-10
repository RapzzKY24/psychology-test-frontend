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
import { useInstansiSessionForm } from "../hooks/use-instansi-session-form";
import { InstansiSessionStepOne, InstansiSessionStepTwo } from "./instansi-session-fields";

interface InstansiSessionDialogProps {
  /** List cache key — the mutation prepends the new session optimistically. */
  listKey: QueryKey;
  /** PUBLISHED tests for step 1 (fetched server-side). */
  tests: Array<{ id: string; name: string }>;
  /** Own employees for step 2 (fetched server-side). */
  employees: Array<{ id: string; name: string }>;
}

export function InstansiSessionDialog({ listKey, tests, employees }: InstansiSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const { form, mutation, submit } = useInstansiSessionForm(listKey, () => {
    setOpen(false);
    setStep(1);
  });

  const next = async () => {
    const valid = await form.trigger(["title", "testIds"]);
    if (valid) setStep(2);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset();
          setStep(1);
        }
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
          <DialogTitle>Buat Sesi ({step}/2)</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Pilih tes yang dikerjakan peserta."
              : "Pilih peserta dari data pegawai, atur slot dan kedaluwarsa."}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={submit} noValidate className="grid gap-4">
            {step === 1 ? (
              <InstansiSessionStepOne tests={tests} disabled={mutation.isPending} />
            ) : (
              <InstansiSessionStepTwo employees={employees} disabled={mutation.isPending} />
            )}
            <DialogFooter className="gap-2">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Kembali
                </Button>
              )}
              {step === 1 ? (
                <Button type="button" onClick={() => void next()}>
                  Lanjut
                </Button>
              ) : (
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Menyimpan..." : "Buat Sesi"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
