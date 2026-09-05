"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/api/auth-client";
import { betterAuthErrorMessage, resolveSafeNext, SIGNUP_FALLBACK_HOME } from "../constants";
import { SignUpSchema } from "../schemas";
import type { SignUpInput } from "../schemas";

export function useSignUpForm(next?: string | null) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const submit = form.handleSubmit(async (values: SignUpInput) => {
    setFormError(null);
    await authClient.signUp.email(
      // confirmPassword never leaves the client.
      { name: values.name, email: values.email, password: values.password },
      {
        onError: (ctx) => {
          const code = ctx.error?.code;
          if (code === "USER_ALREADY_EXISTS" || code === "INVALID_EMAIL") {
            form.setError("email", { message: betterAuthErrorMessage(ctx.error) });
            return;
          }
          if (code === "PASSWORD_TOO_SHORT") {
            form.setError("password", { message: betterAuthErrorMessage(ctx.error) });
            return;
          }
          setFormError(betterAuthErrorMessage(ctx.error));
        },
        onSuccess: () => {
          // Role is server-assigned PARTICIPANT on sign-up.
          router.replace(resolveSafeNext(next) ?? SIGNUP_FALLBACK_HOME);
          router.refresh();
        },
      },
    );
  });

  return { form, submit, formError, isSubmitting: form.formState.isSubmitting };
}
