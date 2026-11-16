import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthCard } from "@/features/auth/components/auth-card";
import { InstansiSignUpForm } from "@/features/auth/components/instansi-sign-up-form";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { postLoginTarget } from "@/features/auth/constants";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Daftar" };

export default async function DaftarPage({ searchParams }: PageProps<"/daftar">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : null;

  const session = await getServerSession();
  if (session) {
    redirect(postLoginTarget(nextPath, session.user.role));
  }

  return (
    <AuthCard
      title="Daftar"
      description="Buat akun untuk mengerjakan tes dan melihat hasil Anda."
      footerText="Sudah punya akun?"
      footerHref="/masuk"
      footerLinkLabel="Masuk"
      className="max-w-2xl"
    >
      <Tabs defaultValue="personal" className="grid gap-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="instansi">Instansi</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SignUpForm next={nextPath} />
          </Suspense>
        </TabsContent>
        <TabsContent value="instansi">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <InstansiSignUpForm />
          </Suspense>
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
}
