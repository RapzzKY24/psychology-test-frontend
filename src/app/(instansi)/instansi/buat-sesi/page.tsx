import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import type { InstansiTestOption } from "@/features/instansi/sessions/api";
import { fetchPublishedTestsServer } from "@/features/instansi/sessions/api.server";
import { CreateBatchForm } from "@/features/instansi/sessions/components/create-batch-form";

export const metadata: Metadata = { title: "Buat Sesi" };

export default async function BuatSesiPage({
  searchParams,
}: {
  searchParams: Promise<{ testId?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawTestId = Array.isArray(sp.testId) ? sp.testId[0] : sp.testId;

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
        title="Buat Sesi Baru"
        description="Pilih tes dan tentukan jumlah peserta untuk sesi institusi."
      />
      <CreateBatchForm initialTests={tests} initialTestId={rawTestId} />
    </main>
  );
}
