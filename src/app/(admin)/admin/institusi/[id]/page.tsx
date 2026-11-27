import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { isApiError } from "@/lib/api/client";
import { fetchInstitutionServer } from "@/features/admin/institutions/api.server";
import { fetchInstitutionTestPricesServer } from "@/features/admin/institution-prices/api.server";
import { InstitutionPricesIsland } from "@/features/admin/institution-prices/components/institution-prices-island";

export const metadata: Metadata = { title: "Harga Khusus Institusi" };

export default async function InstitutionPricesPage({
  params,
}: PageProps<"/admin/institusi/[id]">) {
  const { id } = await params;

  let institution: Awaited<ReturnType<typeof fetchInstitutionServer>>["data"];
  try {
    institution = (await fetchInstitutionServer(id)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  let prices: Awaited<
    ReturnType<typeof fetchInstitutionTestPricesServer>
  >;
  try {
    prices = await fetchInstitutionTestPricesServer(id);
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href="/admin/institusi"
          className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Kembali ke Data Institusi
        </Link>
        <PageHeader
          title={`Harga Khusus — ${institution.name}`}
          description="Harga deal hasil negosiasi per tes. Kosong berarti harga website."
        />
      </div>
      <InstitutionPricesIsland institutionId={id} initial={prices} />
    </main>
  );
}
