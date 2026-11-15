"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { formatDayShort } from "@/lib/format/format-day-short";
import type { ReviewStatsPoint } from "../types";

const CHART_CONFIG = {
  count: { label: "Hasil masuk", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ReviewIncomingChart({ incoming }: { incoming: ReviewStatsPoint[] }) {
  if (incoming.every((point) => point.count === 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada hasil masuk pada rentang ini.
      </p>
    );
  }

  return (
    <ChartContainer
      config={CHART_CONFIG}
      className="h-64 w-full"
      role="img"
      aria-label="Grafik batang jumlah hasil tes baru per hari selama empat belas hari terakhir"
    >
      <BarChart data={incoming} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDayShort}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDayShort(String(value))}
            />
          }
        />
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
