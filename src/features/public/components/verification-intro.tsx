import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PUBLIC_COPY } from "../copy";

interface VerificationIntroProps {
  title: string;
  description: string;
}

/** Shared header for every verification route. */
export function VerificationIntro({ title, description }: VerificationIntroProps) {
  return (
    <header className="mx-auto max-w-2xl space-y-4 text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-2xl">
        <ShieldCheck className="size-6" aria-hidden />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      <Link
        href="/bantuan#verifikasi"
        className="text-primary inline-block text-sm font-medium hover:underline"
      >
        {PUBLIC_COPY.verification.helpLink}
      </Link>
    </header>
  );
}
