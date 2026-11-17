import { CreditCard, FileText, Monitor, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PUBLIC_COPY } from "../copy";
import { InfoCard } from "./info-card";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = {
  dashboard: Monitor,
  report: FileText,
  invoice: CreditCard,
  access: ShieldCheck,
};

/** What an institution gets, as four cards under the hero. */
export function CompanyPerks() {
  const copy = PUBLIC_COPY.company;

  return (
    <section className="space-y-5">
      <SectionHeading title={copy.perksTitle} />
      <div className="grid gap-5 sm:grid-cols-2">
        {copy.perks.map((perk) => (
          <InfoCard key={perk.key} icon={ICONS[perk.key] ?? Monitor} title={perk.title}>
            {perk.body}
          </InfoCard>
        ))}
      </div>
    </section>
  );
}
