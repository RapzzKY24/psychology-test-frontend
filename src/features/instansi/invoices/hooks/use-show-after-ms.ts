"use client";

import { useEffect, useState } from "react";

/**
 * True once `active` has stayed true for `delayMs`.
 *
 * Provisioning a payment link is normally instant, so a retry button shown at
 * once would invite the user to hammer the gateway. Waiting one poll cycle
 * separates "still working" from "it did not work".
 */
export function useShowAfterMs(active: boolean, delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setElapsed(true), delayMs);
    // The reset lives in the cleanup, not the effect body: flipping the flag
    // back to false must also clear the timer's verdict, and doing it here
    // keeps the effect free of a synchronous setState.
    return () => {
      clearTimeout(timer);
      setElapsed(false);
    };
  }, [active, delayMs]);

  return active && elapsed;
}
