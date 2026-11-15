import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { fetchPublicPsychologistsServer, fetchPublicTestServer } from "@/features/public/api";
import { TestDetailView } from "@/features/public/components/test-detail-view";
import { getServerSession } from "@/lib/api/server";

/** CPMI is another name for WPT — old links and bookmarks keep working. */
const SLUG_ALIASES: Record<string, string> = { cpmi: "wpt" };

export async function generateMetadata({ params }: PageProps<"/tes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPublicTestServer(SLUG_ALIASES[slug] ?? slug);
    return { title: data.name, description: data.description };
  } catch {
    return { title: "Tes tidak ditemukan" };
  }
}

export default async function TestDetailPage({ params }: PageProps<"/tes/[slug]">) {
  const { slug } = await params;
  const alias = SLUG_ALIASES[slug];
  if (alias) redirect(`/tes/${alias}`);

  let test;
  try {
    test = (await fetchPublicTestServer(slug)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  // The credential block is an enhancement: if the endpoint is down the page
  // still sells the test, it just omits who signs it.
  const [userRole, psychologists] = await Promise.all([
    getServerSession().then((session) => session?.user?.role ?? null),
    fetchPublicPsychologistsServer()
      .then((response) => response.data)
      .catch(() => []),
  ]);

  return <TestDetailView test={test} role={userRole} psychologists={psychologists} />;
}
