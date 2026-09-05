"use client";

import type { ComponentProps } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

interface SignOutButtonProps extends ComponentProps<typeof Button> {
  label?: string;
}

export function SignOutButton({ label = "Keluar", ...props }: SignOutButtonProps) {
  const signOut = useSignOut();

  return (
    <Button {...props} onClick={signOut}>
      <LogOut className="size-4" aria-hidden />
      {label}
    </Button>
  );
}
