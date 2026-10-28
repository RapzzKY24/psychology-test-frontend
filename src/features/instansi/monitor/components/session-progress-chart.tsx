"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { SessionProgressItem } from "../api";

const CHART_CONFIG = {
  completed: { label: "Selesai", color: "var(--chart-1)" },
  inProgress: { label: "Dikerjakan", color: "var(--chart-3)" },
  notStarted: { label: "Belum mulai", color: "var(--chart-2)" },
  empty: { label: "Slot kosong", color: "var(--chart-5)" },
} satisfies ChartConfig;

const TITLE_LIMIT = 22;

function shortTitle(title: string): string {
  return title.length > TITLE_LIMIT ? `${title.slice(0, TITLE_LIMIT)}…` : title;
}

export function SessionProgressChart({ sessions }: { sessions: SessionProgressItem[] }) {
  if (sessions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada sesi untuk dipantau.
      </p>
    );
  }

  const data = sessions.map((session) => ({
    ...session,
    label: shortTitle(session.title),
  }));
  const maxSlots = Math.max(...sessions.map((session) => session.slotLimit), 1);

  return (
    <ChartContainer config={CHART_CONFIG} className="h-72">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          domain={[0, maxSlots]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={148}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <ChartTooltip />
        <Bar
          dataKey="completed"
          name="Selesai"
          stackId="slots"
          fill="var(--color-completed)"
          radius={[4, 0, 0, 4]}
        />
        <Bar
          dataKey="inProgress"
          name="Dikerjakan"
          stackId="slots"
          fill="var(--color-inProgress)"
        />
        <Bar
          dataKey="notStarted"
          name="Belum mulai"
          stackId="slots"
          fill="var(--color-notStarted)"
        />
        <Bar
          dataKey="empty"
          name="Slot kosong"
          stackId="slots"
          fill="var(--color-empty)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
