import Link from "next/link";
import { Award, ClipboardList, FileCheck2, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeOverviewCounts } from "@/lib/api/types";

const CARDS = [
  {
    key: "inProgress",
    title: "Dikerjakan",
    hint: "tes yang belum selesai",
    icon: ClipboardList,
    href: "/dashboard/riwayat?stage=IN_PROGRESS",
  },
  {
    key: "awaitingReview",
    title: "Menunggu review",
    hint: "hasil menunggu psikolog",
    icon: Hourglass,
    href: "/dashboard/riwayat?stage=AWAITING_REVIEW",
  },
  {
    key: "resultsReady",
    title: "Hasil siap",
    hint: "hasil sudah dirilis",
    icon: FileCheck2,
    href: "/dashboard/riwayat?stage=APPROVED",
  },
  {
    key: "certificatesReady",
    title: "Sertifikat",
    hint: "sertifikat aktif",
    icon: Award,
    href: "/dashboard/sertifikat",
  },
] as const;

/** Four counts, each a shortcut to the tab that lists the rows behind it. */
export function OverviewStats({ counts }: { counts: MeOverviewCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.key} href={card.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium leading-snug">{card.title}</CardTitle>
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">{counts[card.key]}</p>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
