import {
  fetchPublicArticlesServer,
  fetchPublicStatsServer,
  fetchPublicTestsServer,
} from "@/features/public/api";
import { LandingArticlesBand } from "@/features/public/components/landing-articles-band";
import { LandingB2bBand } from "@/features/public/components/landing-b2b-band";
import { LandingHero } from "@/features/public/components/landing-hero";
import { LandingProofBand } from "@/features/public/components/landing-proof-band";
import { LandingTestsBand } from "@/features/public/components/landing-tests-band";

/** Bands alternate white / gray so the page reads as separate chapters. */
export default async function LandingPage() {
  const [tests, articles, stats] = await Promise.all([
    fetchPublicTestsServer({ limit: 3 }).catch(() => null),
    fetchPublicArticlesServer({ limit: 3 }).catch(() => null),
    // The band is an enhancement: without counts the page still works.
    fetchPublicStatsServer()
      .then((response) => response.data)
      .catch(() => null),
  ]);

  return (
    <main className="w-full">
      <LandingHero />
      <LandingProofBand stats={stats} />
      <LandingTestsBand tests={tests?.data ?? []} total={tests?.meta?.total ?? 0} />
      <LandingArticlesBand articles={articles?.data ?? []} />
      <LandingB2bBand />
    </main>
  );
}
