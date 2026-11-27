import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { fetchPublicPsychologistsServer, fetchPublicTestServer } from "@/features/public/api";
import { fetchInstansiTestDetailServer } from "@/features/instansi/sessions/api.server";
import { TestDetailView } from "@/features/public/components/test-detail-view";
import { getServerSession } from "@/lib/api/server";
import type { PublicTestWithDeal } from "@/lib/api/types";

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

  const session = await getServerSession();
  const role = session?.user?.role ?? null;

  // Institutions see their negotiated price here too, not just in checkout.
  // That endpoint is session-scoped and uncached, so it never leaks between
  // institutions; anonymous visitors keep the ISR-cached public catalog.
  let test: PublicTestWithDeal;
  try {
    test =
      role === "INSTANSI"
        ? (await fetchInstansiTestDetailServer(slug)).data
        : (await fetchPublicTestServer(slug)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  // The credential block is an enhancement: if the endpoint is down the page
  // still sells the test, it just omits who signs it.
  const psychologists = await fetchPublicPsychologistsServer()
    .then((response) => response.data)
    .catch(() => []);

  return <TestDetailView test={test} role={role} psychologists={psychologists} />;
}
