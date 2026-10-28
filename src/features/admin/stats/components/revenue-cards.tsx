import { ClipboardCheck, ReceiptText, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIdr } from "@/lib/format/format-idr";
import type { AdminRevenueStats } from "../types";

export function RevenueCards({ stats }: { stats: AdminRevenueStats }) {
  const cards = [
    {
      title: "Pendapatan bulan ini",
      value: formatIdr(stats.currentMonth.total),
      hint: "order B2C + invoice B2B yang lunas",
      icon: Wallet,
    },
    {
      title: "Transaksi lunas",
      value: String(stats.currentMonth.paidCount),
      hint: "pembayaran terverifikasi bulan ini",
      icon: ReceiptText,
    },
    {
      title: "Menunggu review",
      value: String(stats.pendingResults),
      hint: "hasil tes yang belum ditinjau psikolog",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
  );
}
