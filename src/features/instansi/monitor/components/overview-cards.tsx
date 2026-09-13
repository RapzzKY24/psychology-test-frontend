import type { LucideIcon } from "lucide-react";
import { CalendarDays, ClipboardCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InstansiOverview } from "../api";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

export function OverviewCards({ overview }: { overview: InstansiOverview }) {
  const { attempts } = overview;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Pegawai"
        value={String(overview.employees)}
        sub="Terdaftar di master data"
        icon={Users}
      />
      <StatCard
        label="Sesi"
        value={String(overview.sessions)}
        sub="Total sesi dibuat"
        icon={CalendarDays}
      />
      <StatCard
        label="Attempt"
        value={String(attempts.total)}
        sub={`${attempts.completed} selesai · ${attempts.inProgress} berjalan`}
        icon={ClipboardCheck}
      />
    </div>
  );
}
