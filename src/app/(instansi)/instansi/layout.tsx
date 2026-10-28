import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InstansiMobileBar, InstansiSidebar } from "@/components/layout/instansi-sidebar";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: { default: "Instansi", template: "%s | Dasbor Instansi" } };

export default async function InstansiLayout({ children }: LayoutProps<"/instansi">) {
  // Real role check — proxy.ts is only a cheap cookie gate.
  // Non-INSTANSI roles (incl. ADMIN) land on notFound: no cross-console leak.
  const session = await requireServerRole("INSTANSI");
  if (!session) notFound();

  return (
    <div className="flex h-svh flex-1 flex-col overflow-hidden md:flex-row">
      <InstansiMobileBar name={session.user.name} />
      <InstansiSidebar name={session.user.name} email={session.user.email} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
