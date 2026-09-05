import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestBuilderStudio } from "@/features/admin/tests-builder/components/builder-studio";
import { fetchAdminTestDetailServer } from "@/features/admin/tests-builder/api.server";
import { isApiError } from "@/lib/api/client";

export const metadata: Metadata = { title: "Detail Tes" };

export default async function TestDetailPage({ params }: PageProps<"/admin/tes/[id]">) {
  const { id } = await params;

  let detail: Awaited<ReturnType<typeof fetchAdminTestDetailServer>>["data"];
  try {
    const response = await fetchAdminTestDetailServer(id);
    detail = response.data;
  } catch (error) {
    // 404 semantics: someone else's or a deleted test must not leak existence.
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  return <TestBuilderStudio testId={id} initialData={detail} />;
}
