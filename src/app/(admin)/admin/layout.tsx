import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminMobileBar, AdminSidebar } from "@/components/layout/admin-sidebar";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Psikotes Admin" } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Real role check — proxy.ts is only a cheap cookie gate.
  const session = await requireServerRole("ADMIN");
  if (!session) notFound();

  return (
    <div className="flex min-h-svh flex-1 flex-col md:h-svh md:flex-row md:overflow-hidden">
      <AdminMobileBar name={session.user.name} />
      <AdminSidebar name={session.user.name} email={session.user.email} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:overflow-y-auto">{children}</div>
    </div>
  );
}
