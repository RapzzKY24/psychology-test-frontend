import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicTest, UserRole } from "@/lib/api/types";
import { AgeGateCard, AgeGateProvider } from "./age-gate";
import { TestBuyBar, TestBuyPanel } from "./test-buy-panel";
import { TestDetailHeader } from "./test-detail-header";
import { TestFaq } from "./test-faq";
import { TestFacts } from "./test-facts";
import { TestReportContents } from "./test-report-contents";
import { TestSteps } from "./test-steps";

/** Layout of the public test detail page — sections only, no data fetching. */
export function TestDetailView({ test, role }: { test: PublicTest; role: UserRole | null }) {
  return (
    <AgeGateProvider band={test.ageBand}>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-10 md:pb-14">
        <Link
          href="/tes"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Katalog Tes
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <TestDetailHeader test={test} />
            <TestFacts test={test} />
            <AgeGateCard role={role} className="lg:hidden" />
            <TestReportContents />
            <TestSteps />
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
