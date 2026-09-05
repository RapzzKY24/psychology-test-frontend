import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateTestButton } from "@/features/admin/tests-builder/components/create-test-dialog";
import { TestFilters } from "@/features/admin/tests-builder/components/test-filters";
import { TestsTable } from "@/features/admin/tests-builder/components/tests-table";
import { fetchAdminTestsServer } from "@/features/admin/tests-builder/api.server";
import type { TestCategory, TestStatus } from "@/lib/api/types";

export const metadata: Metadata = { title: "Manajemen Tes" };

const VALID_STATUSES: TestStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const VALID_CATEGORIES: TestCategory[] = [
  "PERSONALITY",
  "COGNITIVE",
  "WORK_STYLE",
  "INTEREST",
  "PROJECTIVE",
];

function parse(value: string | string[] | undefined, allowed: readonly string[]): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first && allowed.includes(first) ? first : undefined;
}

export default async function TesPage({ searchParams }: PageProps<"/admin/tes">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = parse(sp.status, VALID_STATUSES) as TestStatus | undefined;
  const category = parse(sp.category, VALID_CATEGORIES) as TestCategory | undefined;

  const { data, meta } = await fetchAdminTestsServer({ page, status, category });
  const tableMeta = meta ?? {
    page,
    limit: 10,
    total: data.length,
    totalPages: 1,
  };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Manajemen Tes"
          description="Buat dan kelola instrumen: pengaturan, soal, dan interpretasi."
        />
        <CreateTestButton />
      </div>
      <TestFilters status={status} category={category} />
      <TestsTable rows={data} meta={tableMeta} status={status} category={category} />
    </main>
  );
}
