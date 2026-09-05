"use client";

import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FORM_INVALID_TOAST } from "@/features/admin/copy";
import type { SessionSummary } from "@/lib/api/types";
import type { QueryKey } from "@tanstack/react-query";
import { useCreateSession } from "./use-session-mutations";
import { CreateSessionSchema } from "../schemas";
import type { CreateSessionInput } from "../schemas";

/** Form logic for the create-session dialog (§6.3 — logic in the hook). */
export function useCreateSessionForm(
  listKey: QueryKey,
  onCreated: (created: SessionSummary) => void,
) {
  const form = useForm<CreateSessionInput>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      title: "",
      institutionId: "",
      testIds: [],
      slotLimit: 20,
      expiresAt: "",
      pin: "",
    },
  });

  const mutation = useCreateSession(listKey, onCreated);

  const toggleTest = useCallback(
    (id: string, checked: boolean) => {
      const current = form.getValues("testIds") ?? [];
      const next = checked ? [...current, id] : current.filter((v) => v !== id);
      form.setValue("testIds", next, { shouldDirty: true });
    },
    [form],
  );

  const submit = form.handleSubmit(
    (values) => mutation.mutateAsync(values),
    () => toast.error(FORM_INVALID_TOAST),
  );

  return { form, mutation, toggleTest, submit };
}
