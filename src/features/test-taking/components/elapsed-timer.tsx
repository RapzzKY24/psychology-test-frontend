"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { formatElapsed } from "@/lib/format/format-elapsed";
import { cn } from "@/lib/utils";

interface ElapsedTimerProps {
  running: boolean;
  /**
   * Seconds left when the test has a hard limit. The value is computed by the
   * runner from the server deadline — this component only renders it.
   */
  remainingSeconds?: number | null;
}

/**
 * Informative stopwatch for untimed tests, countdown for timed ones. A timed
 * test never trusts the local clock: `remainingSeconds` already carries the
 * server's deadline, corrected for drift at mount.
 */
export function ElapsedTimer({ running, remainingSeconds }: ElapsedTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const timed = typeof remainingSeconds === "number";

  useEffect(() => {
    if (!running || timed) return;
    const id = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => clearInterval(id);
  }, [running, timed]);

  const seconds = timed ? Math.max(0, remainingSeconds ?? 0) : elapsed;
  const urgent = timed && seconds <= 60;

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm tabular-nums",
        urgent ? "font-medium text-destructive" : "text-muted-foreground",
      )}
      aria-label={`${timed ? "Sisa waktu" : "Waktu berjalan"} ${formatElapsed(seconds)}`}
    >
      <Timer className="size-4" aria-hidden />
      {formatElapsed(seconds)}
    </span>
  );
}
