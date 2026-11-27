import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type {
  PublicPsychologist,
  PublicTestWithDeal,
  UserRole,
} from "@/lib/api/types";
import { AgeGateCard, AgeGateProvider } from "./age-gate";
import { TestBeforeStart } from "./test-before-start";
import { TestBuyBar, TestBuyPanel } from "./test-buy-panel";
import { TestDeliverables } from "./test-deliverables";
import { TestDetailHeader } from "./test-detail-header";
import { TestFaq } from "./test-faq";
import { TestFacts } from "./test-facts";
import { TestPsychologistCard } from "./test-psychologist-card";
import { TestSteps } from "./test-steps";

/** Layout of the public test detail page — sections only, no data fetching. */
export function TestDetailView({
  test,
  role,
  psychologists,
}: {
  test: PublicTestWithDeal;
  role: UserRole | null;
  psychologists: PublicPsychologist[];
}) {
  return (
    <AgeGateProvider band={test.ageBand}>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-10 md:pb-14">
        <Link
          href="/tes"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Semua Tes
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <TestDetailHeader test={test} />
            <TestFacts test={test} />
            <AgeGateCard role={role} className="lg:hidden" />
            <TestBeforeStart />
            <TestDeliverables test={test} role={role} />
            <TestSteps />
            <TestPsychologistCard psychologists={psychologists} />
            <TestFaq />
          </div>

          <aside className="hidden lg:block">
            <TestBuyPanel test={test} role={role} />
          </aside>
        </div>

        <TestBuyBar test={test} role={role} />
      </main>
    </AgeGateProvider>
  );
}
