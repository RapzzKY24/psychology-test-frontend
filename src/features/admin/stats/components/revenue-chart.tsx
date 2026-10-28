"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { formatIdr } from "@/lib/format/format-idr";
import { formatIdrCompact } from "@/lib/format/format-idr-compact";
import { formatMonthShort } from "@/lib/format/format-month-short";
import type { MonthlyRevenue } from "../types";

const CHART_CONFIG = {
  orders: { label: "B2C (order)", color: "var(--chart-1)" },
  invoices: { label: "B2B (invoice)", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RevenueChart({ months }: { months: MonthlyRevenue[] }) {
  if (months.every((row) => row.total === 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada pembayaran lunas pada rentang ini.
      </p>
    );
  }

  return (
    <ChartContainer
      config={CHART_CONFIG}
      className="h-72 w-full"
      role="img"
      aria-label="Grafik batang pendapatan order B2C dan invoice B2B enam bulan terakhir"
    >
      <BarChart data={months} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonthShort}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickFormatter={formatIdrCompact}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonthShort(String(value))}
              formatter={(value) => formatIdr(Number(value))}
            />
          }
        />
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
