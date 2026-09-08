"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError, ERROR_MESSAGES } from "@/lib/api/error";
import { registerInstitution } from "@/lib/api/instansi-auth";
import { roleHome } from "../constants";
import { InstansiSignUpSchema } from "../schemas";
import type { InstansiSignUpInput } from "../schemas";

export function useInstansiSignUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const form = useForm<InstansiSignUpInput>({
    resolver: zodResolver(InstansiSignUpSchema),
    defaultValues: {
      companyName: "",
      picName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = form.handleSubmit(async (values: InstansiSignUpInput) => {
    setFormError(null);
    setDuplicateEmail(false);
    // confirmPassword never leaves the client.
    const { confirmPassword: _confirm, ...payload } = values;
    void _confirm;
    try {
      await registerInstitution(payload);
      router.replace(roleHome("INSTANSI"));
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 409) {
        form.setError("email", { message: ERROR_MESSAGES.duplicate_email });
        setDuplicateEmail(true);
        return;
      }
      if (error instanceof ApiError && error.statusCode === 422 && error.details) {
        for (const detail of error.details) {
          const field = detail.split(":")[0]?.trim() as keyof InstansiSignUpInput | undefined;
          if (field && field in form.getValues()) {
            form.setError(field, { message: detail });
          } else {
            setFormError(detail);
          }
        }
        return;
      }
      setFormError(
        error instanceof ApiError ? error.message : "Terjadi kesalahan — coba lagi.",
      );
    }
  });

  return { form, submit, formError, duplicateEmail, isSubmitting: form.formState.isSubmitting };
}
