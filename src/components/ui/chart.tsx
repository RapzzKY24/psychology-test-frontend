"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartSeriesConfig {
  label: string;
  /** Must be a design token (var(--chart-1) … var(--chart-5)). */
  color: string;
}

export type ChartConfig = Record<string, ChartSeriesConfig>;

interface ChartContainerProps {
  config: ChartConfig;
  className?: string;
  children: React.ReactElement;
}

/** Shared frame: sizes the plot and exposes every series as `--color-<key>`. */
export function ChartContainer({ config, className, children }: ChartContainerProps) {
  const variables = Object.fromEntries(
    Object.entries(config).map(([key, series]) => [`--color-${key}`, series.color]),
  ) as React.CSSProperties;

  return (
    <div className={cn("h-64 w-full", className)} style={variables}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface TooltipEntry {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

function ChartTooltipContent({
  active,
  label,
  payload,
  formatValue,
  formatLabel,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label !== undefined && (
        <p className="mb-1.5 font-medium">
          {formatLabel ? formatLabel(String(label)) : label}
        </p>
      )}
      <ul className="grid gap-1">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums">
              {formatValue
                ? formatValue(Number(entry.value ?? 0))
                : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ChartTooltipProps {
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

export function ChartTooltip({ formatValue, formatLabel }: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
      content={
        <ChartTooltipContent formatValue={formatValue} formatLabel={formatLabel} />
      }
    />
  );
}
