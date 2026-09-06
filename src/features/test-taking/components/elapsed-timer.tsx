"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { formatElapsed } from "@/lib/format/format-elapsed";

/**
 * Informative stopwatch (DISC has no time limit) — starts when the runner
 * mounts, stops when the attempt completes.
 */
export function ElapsedTimer({ running }: { running: boolean }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <span
      className="flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums"
      aria-label={`Waktu berjalan ${formatElapsed(elapsed)}`}
    >
      <Timer className="size-4" aria-hidden />
      {formatElapsed(elapsed)}
    </span>
  );
}
