import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueCards } from "./revenue-cards";
import { RevenueChart } from "./revenue-chart";
import type { AdminRevenueStats } from "../api";

export function RevenueSection({ stats }: { stats: AdminRevenueStats }) {
  return (
    <section className="grid gap-4" aria-labelledby="revenue-heading">
      <h2 id="revenue-heading" className="sr-only">
        Pendapatan
      </h2>
      <RevenueCards stats={stats} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendapatan 6 bulan terakhir</CardTitle>
          <CardDescription>
            Order B2C dan invoice B2B yang sudah lunas, per bulan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart months={stats.months} />
        </CardContent>
      </Card>
    </section>
  );
}
