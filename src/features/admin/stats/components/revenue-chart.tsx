"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { formatIdr } from "@/lib/format/format-idr";
import { formatIdrCompact } from "@/lib/format/format-idr-compact";
import type { MonthlyRevenue } from "../api";

const CHART_CONFIG = {
  orders: { label: "B2C (order)", color: "var(--chart-1)" },
  invoices: { label: "B2B (invoice)", color: "var(--chart-2)" },
} satisfies ChartConfig;

const MONTH_FORMAT = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "2-digit",
});

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) return month;
  return MONTH_FORMAT.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

export function RevenueChart({ months }: { months: MonthlyRevenue[] }) {
  if (months.every((row) => row.total === 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada pembayaran lunas pada rentang ini.
      </p>
    );
  }

  return (
    <ChartContainer config={CHART_CONFIG} className="h-72">
      <BarChart data={months} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickFormatter={formatIdrCompact}
          tickLine={false}
          axisLine={false}
          width={64}
          fontSize={12}
        />
        <ChartTooltip formatValue={formatIdr} formatLabel={formatMonth} />
        <Bar
          dataKey="orders"
          name="B2C (order)"
          stackId="revenue"
          fill="var(--color-orders)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="invoices"
          name="B2B (invoice)"
          stackId="revenue"
          fill="var(--color-invoices)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
