"use client";

import { FileText, Users, Activity, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionAttemptsSummary } from "@/lib/api/types";

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

interface SessionStatsProps {
  participants: number;
  slotLimit: number;
  attempts: SessionAttemptsSummary;
}

/** Aggregate stats from the detail endpoint (counts — no per-participant rows). */
export function SessionStats({ participants, slotLimit, attempts }: SessionStatsProps) {
  const slotsLeft = Math.max(slotLimit - participants, 0);
  const fillRate = slotLimit > 0 ? Math.round((participants / slotLimit) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Peserta"
        value={`${participants}/${slotLimit}`}
        sub={`Sisa ${slotsLeft} slot · terisi ${fillRate}%`}
        icon={<Users className="size-4" aria-hidden />}
      />
      <StatCard
        label="Attempt"
        value={String(attempts.total)}
        icon={<FileText className="size-4" aria-hidden />}
      />
      <StatCard
        label="Sedang dikerjakan"
        value={String(attempts.inProgress)}
        icon={<Activity className="size-4" aria-hidden />}
      />
      <StatCard
        label="Selesai"
        value={String(attempts.completed)}
        icon={<CircleCheck className="size-4" aria-hidden />}
      />
    </div>
  );
}
