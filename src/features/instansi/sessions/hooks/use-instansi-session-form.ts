"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FORM_INVALID_TOAST } from "@/features/admin/copy";
import type { QueryKey } from "@tanstack/react-query";
import { useCreateInstansiSession } from "./use-instansi-session-mutations";
import { CreateInstansiSessionSchema } from "../schemas";
import type { CreateInstansiSessionInput } from "../schemas";

/** Form logic for the create-session wizard (§6.3 — logic in the hook). */
export function useInstansiSessionForm(listKey: QueryKey, onCreated: () => void) {
  const form = useForm<CreateInstansiSessionInput>({
    resolver: zodResolver(CreateInstansiSessionSchema),
    defaultValues: {
      title: "",
      testIds: [],
      employeeIds: [],
      slotLimit: 20,
      expiresAt: "",
      pin: "",
    },
  });

  const mutation = useCreateInstansiSession(listKey, () => {
    form.reset();
    onCreated();
  });

  const submit = form.handleSubmit(
    (values) => mutation.mutateAsync(values),
    () => toast.error(FORM_INVALID_TOAST),
  );

  return { form, mutation, submit };
}
