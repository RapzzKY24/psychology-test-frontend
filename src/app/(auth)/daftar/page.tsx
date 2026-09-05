import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { resolveSafeNext, roleHome } from "@/features/auth/constants";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Daftar" };

export default async function DaftarPage({ searchParams }: PageProps<"/daftar">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : null;

  const session = await getServerSession();
  if (session) {
    redirect(resolveSafeNext(nextPath) ?? roleHome(session.user.role));
  }

  return (
    <AuthCard
      title="Daftar"
      description="Buat akun untuk membeli dan mengerjakan tes psikologi."
      footerText="Sudah punya akun?"
      footerHref="/masuk"
      footerLinkLabel="Masuk"
    >
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <SignUpForm next={nextPath} />
      </Suspense>
    </AuthCard>
  );
}
