import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { resolveSafeNext, roleHome } from "@/features/auth/constants";
import { getServerSession } from "@/lib/api/server";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Masuk" };

export default async function MasukPage({ searchParams }: PageProps<"/masuk">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : null;

  const session = await getServerSession();
  if (session) {
    redirect(resolveSafeNext(nextPath) ?? roleHome(session.user.role));
  }

  return (
    <AuthCard
      title="Masuk"
      description="Masuk untuk membeli dan mengerjakan tes psikologi."
      footerText="Belum punya akun?"
      footerHref="/daftar"
      footerLinkLabel="Daftar"
      className="max-w-2xl"
    >
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <SignInForm next={nextPath} />
      </Suspense>
    </AuthCard>
  );
}
