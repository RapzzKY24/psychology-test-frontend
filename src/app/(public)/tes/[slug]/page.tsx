import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { fetchPublicTestServer } from "@/features/public/api.server";
import { TestDetailView } from "@/features/public/components/test-detail-view";
import { getServerSession } from "@/lib/api/server";

export async function generateMetadata({ params }: PageProps<"/tes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPublicTestServer(slug);
    return { title: data.name, description: data.description };
  } catch {
    return { title: "Tes tidak ditemukan" };
  }
}

export default async function TestDetailPage({ params }: PageProps<"/tes/[slug]">) {
  const { slug } = await params;

  let test;
  try {
    test = (await fetchPublicTestServer(slug)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const userRole = (await getServerSession())?.user?.role ?? null;

  return <TestDetailView test={test} role={userRole} />;
}
