"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { ReviewStatsPoint } from "../api";

const CHART_CONFIG = {
  count: { label: "Hasil masuk", color: "var(--chart-1)" },
} satisfies ChartConfig;

const DAY_FORMAT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

function formatDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return DAY_FORMAT.format(new Date(Date.UTC(year, month - 1, day)));
}

export function ReviewIncomingChart({ incoming }: { incoming: ReviewStatsPoint[] }) {
  if (incoming.every((point) => point.count === 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada hasil masuk pada rentang ini.
      </p>
    );
  }

  return (
    <ChartContainer config={CHART_CONFIG} className="h-64">
      <BarChart data={incoming} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          minTickGap={16}
          fontSize={12}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={32}
          fontSize={12}
        />
        <ChartTooltip formatLabel={formatDay} />
        <Bar
          dataKey="count"
          name="Hasil masuk"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
