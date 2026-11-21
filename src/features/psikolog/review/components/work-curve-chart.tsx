"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { TimedGridScores } from "../lib/timed-grid-scores";

const CHART_CONFIG = {
  correct: { label: "Jawaban benar", color: "var(--chart-1)" },
} satisfies ChartConfig;

/**
 * The work curve: correct answers per lajur, left to right in the order the
 * participant worked them. A flat line is a steady pace; a falling one is the
 * fatigue the Kraepelin factors are read from.
 */
export function WorkCurveChart({ scores }: { scores: TimedGridScores }) {
  if (scores.curve.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada lajur yang dikerjakan.
      </p>
    );
  }

  const data = scores.curve.map((correct, index) => ({
    lajur: scores.columns[index]?.column ?? index + 1,
    correct,
  }));
  const metrics = Object.entries(scores.metrics);

  return (
    <div className="space-y-5">
      {metrics.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([code, metric]) => (
            <div key={code} className="rounded-xl border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.band ?? "di luar tabel norma"}
              </p>
            </div>
          ))}
        </div>
      )}

      <ChartContainer
        config={CHART_CONFIG}
        className="h-64 w-full"
        role="img"
        aria-label="Grafik kurva kerja: jumlah jawaban benar per lajur"
      >
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="lajur"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent labelFormatter={(value) => `Lajur ${value}`} />}
          />
          <Line
            dataKey="correct"
            name="Jawaban benar"
            stroke="var(--color-correct)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground">
        Total {scores.total} lajur · {scores.correct} benar · {scores.wrong} salah ·{" "}
        {scores.skipped} terlewati.
      </p>
    </div>
  );
}
