import Link from "next/link";
import { cn } from "@/lib/utils";
import { PARTICIPANT_STAGES, PARTICIPANT_STAGE_LABEL, type ParticipantStage } from "../stages";

const ITEMS: Array<{ value?: ParticipantStage; label: string }> = [
  { label: "Semua" },
  ...PARTICIPANT_STAGES.map((value) => ({
    value,
    label: PARTICIPANT_STAGE_LABEL[value],
  })),
];

/** Links, not buttons: the filter is part of the URL, so the page stays RSC. */
export function RiwayatFilters({ stage }: { stage?: ParticipantStage }) {
  return (
    <div
      role="group"
      aria-label="Filter status riwayat"
      className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg border p-1"
    >
      {ITEMS.map((item) => {
        const active = item.value === stage;
        const href = item.value ? `/dashboard/riwayat?stage=${item.value}` : "/dashboard/riwayat";
        return (
          <Link
            key={item.label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
