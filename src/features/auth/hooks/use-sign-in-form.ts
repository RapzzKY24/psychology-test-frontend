"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/api/auth-client";
import { betterAuthErrorMessage, postLoginTarget } from "../constants";
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
        onSuccess: async () => {
          // Fresh session (not the sign-in payload): guarantees the
          // server-assigned role, including INSTANSI for institution users.
          const { data: session } = await authClient.getSession();
          const role = (session?.user as { role?: string } | undefined)?.role ?? "";
          router.replace(postLoginTarget(next, role));
          router.refresh();
        },
      },
    );
  });

  return { form, submit, formError, isSubmitting: form.formState.isSubmitting };
}
