"use client";

import { useEffect, useState } from "react";

function remaining(target: number): string {
  const diff = target - Date.now();
  if (diff <= 0) return "Kedaluwarsa";
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return hours > 0 ? `${hours} jam ${mmss}` : mmss;
}

/** Live countdown to the invoice expiry. */
export function InvoiceCountdown({ expiresAt }: { expiresAt: string }) {
  const target = new Date(expiresAt).getTime();
  const [label, setLabel] = useState(() => remaining(target));

  useEffect(() => {
    const id = setInterval(() => setLabel(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span className="tabular-nums">{label}</span>;
}
