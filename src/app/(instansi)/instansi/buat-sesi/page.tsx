import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import type { InstansiTestOption } from "@/features/instansi/sessions/api";
import { fetchPublishedTestsServer } from "@/features/instansi/sessions/api.server";
import { SingleTestCheckout } from "@/features/instansi/sessions/components/single-test-checkout";

export const metadata: Metadata = { title: "Checkout Sesi" };

export default async function BuatSesiPage({
  searchParams,
}: {
  searchParams: Promise<{ testId?: string | string[] }>;
}) {
  const sp = await searchParams;
  const testId = Array.isArray(sp.testId) ? sp.testId[0] : sp.testId;

  // The catalog is the only door: a checkout always starts from a test card.
  if (!testId) redirect("/tes");

  // A failed fetch is not fatal: the island retries client-side.
  let tests: InstansiTestOption[] | undefined;
  try {
    tests = (await fetchPublishedTestsServer()).data;
  } catch {
    tests = undefined;
  }

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Checkout Sesi"
        description="Tentukan jumlah peserta, lalu bayar untuk mengaktifkan sesi."
      />
      <SingleTestCheckout testId={testId} initialTests={tests} />
    </main>
  );
}
