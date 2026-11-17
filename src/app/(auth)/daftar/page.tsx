import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthSplitCard } from "@/features/auth/components/auth-split-card";
import { InstansiSignUpForm } from "@/features/auth/components/instansi-sign-up-form";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { postLoginTarget } from "@/features/auth/constants";
import { AUTH_COPY } from "@/features/auth/copy";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Buat akun" };

export default async function DaftarPage({ searchParams }: PageProps<"/daftar">) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : null;
  const peran = params.peran === "instansi" ? "instansi" : "personal";

  const session = await getServerSession();
  if (session) {
    redirect(postLoginTarget(nextPath, session.user.role));
  }

  return (
    <AuthSplitCard
      title={AUTH_COPY.daftar.title}
      description={AUTH_COPY.daftar.description}
      footer={
        <p>
          {AUTH_COPY.daftar.footerQuestion}{" "}
          <Link
            href="/masuk?langsung=1"
            className="text-foreground font-medium underline underline-offset-4"
          >
            {AUTH_COPY.daftar.footerAction}
          </Link>
        </p>
      }
    >
      <Tabs defaultValue={peran} className="grid gap-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">{AUTH_COPY.daftar.tabs.pribadi}</TabsTrigger>
          <TabsTrigger value="instansi">{AUTH_COPY.daftar.tabs.instansi}</TabsTrigger>
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
    </AuthSplitCard>
  );
}
