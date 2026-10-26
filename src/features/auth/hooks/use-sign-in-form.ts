"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/api/auth-client";
import { USER_ROLES } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/types";
import { betterAuthErrorMessage, postLoginTarget, resolveSafeNext } from "../constants";
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
          const rawRole = (session?.user as { role?: string } | undefined)?.role;
          const role: UserRole | undefined = (USER_ROLES as readonly string[]).includes(
            rawRole ?? "",
          )
            ? (rawRole as UserRole)
            : undefined;
          router.replace(
            role === "INSTANSI"
              ? resolveSafeNext(next) ?? "/"
              : postLoginTarget(next, role),
          );
          router.refresh();
        },
      },
    );
  });

  return { form, submit, formError, isSubmitting: form.formState.isSubmitting };
}
