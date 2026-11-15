import { CheckCircle2, Undo2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewIncomingChart } from "./review-incoming-chart";
import type { ReviewStats } from "../types";

export function ReviewStatsSection({ stats }: { stats: ReviewStats }) {
  const cards = [
    {
      title: "Disetujui (7 hari)",
      value: stats.mine.approved7d,
      hint: "hasil yang Anda setujui",
      icon: CheckCircle2,
    },
    {
      title: "Dikembalikan (7 hari)",
      value: stats.mine.returned7d,
      hint: "hasil yang Anda minta diperbaiki",
      icon: Undo2,
    },
  ];

  return (
    <section className="grid gap-4" aria-labelledby="review-stats-heading">
      <h2 id="review-stats-heading" className="sr-only">
        Statistik review
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Antrean masuk 14 hari terakhir</CardTitle>
          <CardDescription>
            Jumlah hasil tes baru per hari — lihat apakah besok akan menumpuk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewIncomingChart incoming={stats.incoming} />
        </CardContent>
      </Card>
    </section>
  );
}
