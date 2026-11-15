import {
  Brain,
  CheckCircle2,
  Compass,
  Fingerprint,
  ListChecks,
  Percent,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * RANK_GROUP (RMIB) keeps `dominant` and a three-field `type` next to the same
 * `scales` shape a tally uses. The workbook prints "Minat Tertinggi ke-1/2/3",
 * so the headline is the top three — not a single winning scale.
 */
function rankStats(scores: Record<string, unknown>): Stat[] | null {
  const dominant = scores.dominant;
  if (typeof dominant !== "string" || !dominant.trim()) return null;
  if (!isRecord(scores.scales)) return null;

  const stats: Stat[] = [
    { key: "dominant", label: "Minat utama", value: dominant.trim(), icon: Compass },
  ];
  const type = scores.type;
  if (typeof type === "string" && type.trim()) {
    stats.push({
      key: "type",
      label: "Tiga minat terkuat",
      value: type.trim().split("_").join(" · "),
      icon: Fingerprint,
    });
  }
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

/**
 * MARK_GROUP (KUDER) prints the same "dominant + top three" headline as a
 * ranking instrument, but each item is a whole list, so the counter is groups.
 */
function markStats(scores: Record<string, unknown>): Stat[] | null {
  const dominant = scores.dominant;
  if (typeof dominant !== "string" || !dominant.trim()) return null;
  if (!isRecord(scores.scales)) return null;

  const stats: Stat[] = [
    { key: "dominant", label: "Minat utama", value: dominant.trim(), icon: Compass },
  ];
  const type = scores.type;
  if (typeof type === "string" && type.trim()) {
    stats.push({
      key: "type",
      label: "Tiga minat terkuat",
      value: type.trim().split("_").join(" · "),
      icon: Fingerprint,
    });
  }
  const { answered, total } = scores;
  if (typeof answered === "number" && typeof total === "number") {
    stats.push({
      key: "answered",
      label: "Kelompok terjawab",
      value: `${answered}/${total}`,
      icon: ListChecks,
    });
  }
  return stats;
}

interface Validity {
  raw: number;
  max: number;
  band: string | null;
  valid: boolean;
}

/**
 * KUDER bands the count of marks on its flagged activities. The workbook calls
 * the protocol unusable when too few of them carry a mark, so the result page
 * says so instead of letting the reader take the percentiles at face value.
 */
function validityOf(scores: Record<string, unknown>): Validity | null {
  const value = scores.verification;
  if (!isRecord(value)) return null;
  if (typeof value.raw !== "number" || typeof value.max !== "number") return null;
  const band = typeof value.band === "string" && value.band.trim() ? value.band.trim() : null;
  return { raw: value.raw, max: value.max, band, valid: band === "Valid" };
}

function ValidityNote({ validity }: { validity: Validity }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 text-sm",
        validity.valid ? "bg-primary/5" : "border-destructive/30 bg-destructive/5",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md",
          validity.valid ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
        )}
      >
        <ShieldCheck className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-medium tabular-nums">
          Skala validitas {validity.raw}/{validity.max}
        </p>
        {validity.band && <p className="text-muted-foreground">{validity.band}</p>}
      </div>
    </div>
  );
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

/**
 * LIKERT shares the tally shape but adds a band per scale, so the winner is a
 * scale plus its category ("A / Tinggi") — not a personality type.
 */
function likertStats(scores: Record<string, unknown>): Stat[] | null {
  const type = scores.type;
  if (typeof type !== "string" || !type.trim()) return null;
  if (typeof scores.band !== "string" || !scores.band.trim()) return null;
  if (!isRecord(scores.scales)) return null;

  const stats: Stat[] = [
    { key: "type", label: "Skala tertinggi", value: type.trim(), icon: Fingerprint },
    { key: "band", label: "Kategori", value: scores.band.trim(), icon: TrendingUp },
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

/**
 * STYLE_GRID (MSDT) names a leadership style from the high/low pattern of its
 * dimensions, so the headline is the style — the dimension bars below it show
 * why that style won.
 */
function styleGridStats(scores: Record<string, unknown>): Stat[] | null {
  const profile = scores.profile;
  if (!isRecord(profile) || typeof profile.label !== "string" || !profile.label.trim()) {
    return null;
  }

  const stats: Stat[] = [
    {
      key: "profile",
      label: "Gaya kepemimpinan",
      value: profile.label.trim(),
      icon: Fingerprint,
    },
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

/**
 * Every dimension of a style grid is converted to a level (0–4 for MSDT), and
 * the cut decides whether it counts as high. The bar draws the level against
 * the table's own top, so a different instrument's scale still fits.
 */
function styleGridBars(scores: Record<string, unknown>): ScaleBar[] | null {
  if (!isRecord(scores.dimensions)) return null;
  const maxLevel = typeof scores.maxLevel === "number" && scores.maxLevel > 0 ? scores.maxLevel : 4;

  const bars: ScaleBar[] = [];
  for (const [code, value] of Object.entries(scores.dimensions)) {
    if (!isRecord(value) || typeof value.level !== "number") continue;
    bars.push({
      label: typeof value.label === "string" && value.label.trim() ? value.label : code,
      value: (value.level / maxLevel) * 100,
      band: `${value.level}/${maxLevel} · ${value.high ? "Tinggi" : "Rendah"}`,
      display: value.level.toString(),
    });
  }
  return bars.length > 0 ? bars : null;
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

interface ScaleBar {
  label: string;
  /** Percent of the scale's own ceiling, so scales of different length compare. */
  value: number;
  band?: string;
  /** What the number next to the bar reads; the bar still uses `value`. */
  display?: string;
}

/**
 * Tally families keep every scale one level down under `scales`, each with its
 * own `{ score, max, percent, band }`. The percent is what the reader compares;
 * the band is what the workbook prints next to it.
 */
function scaleBars(scores: Record<string, unknown>): ScaleBar[] | null {
  if (!isRecord(scores.scales)) return null;
  const bars: ScaleBar[] = [];
  for (const [label, value] of Object.entries(scores.scales)) {
    if (!isRecord(value) || typeof value.percent !== "number") continue;
    bars.push({
      label,
      value: value.percent,
      band: typeof value.band === "string" ? value.band : undefined,
    });
  }
  return bars.length > 0 ? bars : null;
}

interface SectionRow {
  label: string;
  /** Percent per section, in the same order as the table's columns. */
  values: (number | null)[];
}

interface SectionTable {
  sections: string[];
  rows: SectionRow[];
}

/** "EFFECTIVENESS" -> "Effectiveness"; keeps a longer code readable. */
function sectionTitle(code: string): string {
  return code
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * A multi-section inventory (MSAI) rates the same roles more than once, so the
 * bars above only tell a third of the story. This lines the sections up per
 * role — behaviour next to effectiveness and importance — which is the
 * comparison the workbook's summary block prints.
 */
function sectionTable(scores: Record<string, unknown>): SectionTable | null {
  if (!isRecord(scores.sections)) return null;
  const sections = Object.keys(scores.sections);
  if (sections.length < 2 || !isRecord(scores.scales)) return null;

  const rows: SectionRow[] = [];
  for (const label of Object.keys(scores.scales)) {
    const values = sections.map((section) => {
      const bucket = (scores.sections as Record<string, unknown>)[section];
      if (!isRecord(bucket)) return null;
      const entry = bucket[label];
      return isRecord(entry) && typeof entry.percent === "number" ? entry.percent : null;
    });
    rows.push({ label, values });
  }
  return rows.length > 0 ? { sections, rows } : null;
}

function SectionTable({ table }: { table: SectionTable }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-primary/5 text-left">
            <th className="px-3 py-2 font-medium text-muted-foreground">Skala</th>
            {table.sections.map((section) => (
              <th key={section} className="px-3 py-2 text-right font-medium text-muted-foreground">
                {sectionTitle(section)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.label} className="border-b last:border-b-0">
              <td className="px-3 py-2 font-medium">{row.label}</td>
              {row.values.map((value, index) => (
                <td
                  key={table.sections[index]}
                  className="px-3 py-2 text-right tabular-nums text-muted-foreground"
                >
                  {value === null ? "–" : `${value}%`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCards({ stats }: { stats: Stat[] }) {
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

function ScaleBars({ bars }: { bars: ScaleBar[] }) {
  return (
    <div className="space-y-3">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">
              {bar.label}
              {bar.band && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">{bar.band}</span>
              )}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {bar.display ?? `${bar.value}%`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.max(bar.value, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScoreSummary({ scores }: { scores: Record<string, unknown> }) {
  const stats =
    rightWrongStats(scores) ??
    likertStats(scores) ??
    styleGridStats(scores) ??
    markStats(scores) ??
    rankStats(scores) ??
    tallyStats(scores) ??
    typeStats(scores);
  const scales = styleGridBars(scores) ?? scaleBars(scores);
  const table = sectionTable(scores);
  const validity = validityOf(scores);

  if (stats || scales || table || validity) {
    return (
      <div className="space-y-4">
        {stats && <StatCards stats={stats} />}
        {scales && <ScaleBars bars={scales} />}
        {validity && <ValidityNote validity={validity} />}
        {table && <SectionTable table={table} />}
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
