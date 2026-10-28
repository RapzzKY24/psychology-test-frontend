import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PsikologMobileBar, PsikologSidebar } from "@/components/layout/psikolog-sidebar";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: { default: "Psikolog", template: "%s | Dasbor Psikolog" } };

export default async function PsikologLayout({ children }: LayoutProps<"/psikolog">) {
  // Real role check — proxy.ts is only a cheap cookie gate.
  // Non-PSYCHOLOGIST roles (incl. ADMIN) land on notFound: no cross-console leak.
  const session = await requireServerRole("PSYCHOLOGIST");
  if (!session) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col md:pl-60">
      <PsikologMobileBar name={session.user.name} />
      <PsikologSidebar name={session.user.name} email={session.user.email} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
