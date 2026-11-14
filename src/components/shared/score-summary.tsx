import { Brain, CheckCircle2, Fingerprint, ListChecks, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stat {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

interface Bar {
  label: string;
  value: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * RIGHT_WRONG_NORM stores `{ raw, total, perItem, iq? }`. Drawing a bar for
 * `raw` and `total` says nothing about the result, so that family gets a stat
 * row instead.
 */
function rightWrongStats(scores: Record<string, unknown>): Stat[] | null {
  const raw = scores.raw;
  const total = scores.total;
  if (typeof raw !== "number" || typeof total !== "number") return null;

  const stats: Stat[] = [
    { key: "raw", label: "Jawaban benar", value: `${raw}/${total}`, icon: CheckCircle2 },
    {
      key: "accuracy",
      label: "Akurasi",
      value: `${total > 0 ? Math.round((raw / total) * 100) : 0}%`,
      icon: Percent,
    },
  ];
  if (typeof scores.iq === "number") {
    stats.push({ key: "iq", label: "Skor IQ", value: `${scores.iq}`, icon: Brain });
  }
  return stats;
}

/** FORCED_CHOICE_PAIR: the four-letter type is the result, not the counts. */
function typeStats(scores: Record<string, unknown>): Stat[] | null {
  const type = scores.type;
  if (typeof type !== "string" || !type.trim()) return null;

  const stats: Stat[] = [
    { key: "type", label: "Tipe kepribadian", value: type.trim(), icon: Fingerprint },
  ];
  const { answered, total } = scores;
  if (typeof answered === "number" && typeof total === "number") {
    stats.push({
      key: "answered",
      label: "Pernyataan terjawab",
      value: `${answered}/${total}`,
      icon: ListChecks,
    });
  }
  return stats;
}

/**
 * CHOICE_TALLY / PAIR_TALLY keep every scale one level down under `scales`.
 * The winning scale is the result, and it is a code — not a personality type.
 */
function tallyStats(scores: Record<string, unknown>): Stat[] | null {
  const type = scores.type;
  if (typeof type !== "string" || !type.trim()) return null;
  if (!isRecord(scores.scales)) return null;
  const first = Object.values(scores.scales)[0];
  if (!isRecord(first) || typeof first.score !== "number") return null;

  const stats: Stat[] = [
    { key: "type", label: "Skala dominan", value: type.trim(), icon: Fingerprint },
  ];
  const { answered, total } = scores;
  if (typeof answered === "number" && typeof total === "number") {
    stats.push({
      key: "answered",
      label: "Butir terjawab",
      value: `${answered}/${total}`,
      icon: ListChecks,
    });
  }
  return stats;
}

function barsFrom(values: Record<string, unknown>): Bar[] {
  const bars: Bar[] = [];
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "number") bars.push({ label: key, value });
  }
  return bars;
}

/** FORCED_CHOICE_DISC keeps its D/I/S/C profile one level down, under `graph`. */
function discBars(scores: Record<string, unknown>): Bar[] | null {
  if (!isRecord(scores.graph)) return null;
  const bars = barsFrom(scores.graph);
  return bars.length > 0 ? bars : null;
}

export function ScoreSummary({ scores }: { scores: Record<string, unknown> }) {
  const stats = rightWrongStats(scores) ?? tallyStats(scores) ?? typeStats(scores);
  if (stats) {
    return (
      <div className="flex flex-wrap gap-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex min-w-40 flex-1 items-start gap-3 rounded-lg border p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <stat.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold leading-tight tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const bars = discBars(scores) ?? barsFrom(scores);
  if (bars.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada skor.</p>;
  }
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="space-y-4">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{bar.label}</span>
            <span className="tabular-nums text-muted-foreground">{bar.value}</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.max((bar.value / maxValue) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
