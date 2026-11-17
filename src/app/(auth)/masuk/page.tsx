import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthGateway } from "@/features/auth/components/auth-gateway";
import { postLoginTarget } from "@/features/auth/constants";
import { resolveEntryState } from "@/features/auth/gateway";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Masuk" };

export default async function MasukPage({ searchParams }: PageProps<"/masuk">) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : null;

  const session = await getServerSession();
  if (session) {
    redirect(postLoginTarget(nextPath, session.user.role));
  }

  const initial = resolveEntryState({
    langsung: typeof params.langsung === "string" ? params.langsung : null,
    mode: typeof params.mode === "string" ? params.mode : null,
    peran: typeof params.peran === "string" ? params.peran : null,
  });

  return <AuthGateway next={nextPath} initial={initial} />;
}
