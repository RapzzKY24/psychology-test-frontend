import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ModuleGrid } from "@/features/admin/overview/components/module-grid";
import { RevenueSection } from "@/features/admin/stats/components/revenue-section";
import { fetchAdminRevenueServer } from "@/features/admin/stats/api.server";
import { REVENUE_MONTHS } from "@/features/admin/stats/constants";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function AdminHomePage() {
  // Next renders the layout and the page in parallel, so the layout's role
  // guard alone would still let this fetch run (and log a 403) for other roles.
  const session = await requireServerRole("ADMIN");
  if (!session) notFound();

  const { data: revenue } = await fetchAdminRevenueServer(REVENUE_MONTHS);

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Ringkasan"
        description="Pusat kendali platform: kelola tes, sesi, pembayaran, dan hasil."
      />
      <RevenueSection stats={revenue} />
      <ModuleGrid />
    </main>
  );
}
