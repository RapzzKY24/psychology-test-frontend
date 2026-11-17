import {
  fetchPublicArticlesServer,
  fetchPublicStatsServer,
  fetchPublicTestsServer,
} from "@/features/public/api";
import { LandingArticlesBand } from "@/features/public/components/landing-articles-band";
import { LandingAudienceBand } from "@/features/public/components/landing-audience-band";
import { LandingB2bBand } from "@/features/public/components/landing-b2b-band";
import { LandingDeliverablesBand } from "@/features/public/components/landing-deliverables-band";
import { LandingFaqBand } from "@/features/public/components/landing-faq-band";
import { LandingHero } from "@/features/public/components/landing-hero";
import { LandingProofBand } from "@/features/public/components/landing-proof-band";
import { LandingStepsBand } from "@/features/public/components/landing-steps-band";
import { LandingTestsBand } from "@/features/public/components/landing-tests-band";
import { LandingVerificationBand } from "@/features/public/components/landing-verification-band";

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
      <LandingAudienceBand />
      <LandingStepsBand />
      <LandingProofBand stats={stats} />
      <LandingTestsBand tests={tests?.data ?? []} total={tests?.meta?.total ?? 0} />
      <LandingDeliverablesBand />
      <LandingArticlesBand articles={articles?.data ?? []} />
      <LandingVerificationBand />
      <LandingFaqBand />
      <LandingB2bBand />
    </main>
  );
}
