"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/api/auth-client";
import { betterAuthErrorMessage, resolveSafeNext, roleHome } from "../constants";
import { SignInSchema } from "../schemas";
import type { SignInInput } from "../schemas";

export function useSignInForm(next?: string | null) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = form.handleSubmit(async (values: SignInInput) => {
    setFormError(null);
    await authClient.signIn.email(
      { email: values.email, password: values.password },
      {
        onError: (ctx) => {
          setFormError(betterAuthErrorMessage(ctx.error));
        },
        onSuccess: (data) => {
          // `role` is an additionalField unknown to the client's inferred type.
          const role = (data.data.user as { role?: string }).role ?? "";
          router.replace(resolveSafeNext(next) ?? roleHome(role));
          router.refresh();
        },
      },
    );
  });

  return { form, submit, formError, isSubmitting: form.formState.isSubmitting };
}
