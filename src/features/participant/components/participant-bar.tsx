"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

/**
 * Participant top bar — light shell for /dashboard, /hasil, and friends.
 * (The runner at /tes stays full-screen by design.)
 */
export function ParticipantBar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold">Psikotes</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:block">
            {name}
          </span>
          <SignOutButton variant="outline" size="sm" label="Keluar" />
        </div>
      </div>
    </header>
  );
}
