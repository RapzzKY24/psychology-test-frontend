"use client";

import { useEffect, useState } from "react";

/**
 * Countdown from the server's `remainingSeconds`.
 *
 * The server number is the source of truth (frontend-standards §3.5): it is
 * anchored once when it arrives, then ticked here. A refetch sends a fresh
 * number and re-anchors, so a backgrounded tab never invents extra time.
 */
export function useRemainingSeconds(serverSeconds: number | null): number | null {
  const [remaining, setRemaining] = useState<number | null>(serverSeconds);
  const [anchor, setAnchor] = useState(serverSeconds);

  // Adjusting state during render is the sanctioned way to react to a new prop:
  // the server sent a fresh countdown, so the display restarts from it.
  if (serverSeconds !== anchor) {
    setAnchor(serverSeconds);
    setRemaining(serverSeconds);
  }

  useEffect(() => {
    if (serverSeconds === null) return;
    const deadline = Date.now() + serverSeconds * 1000;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [serverSeconds]);

  return remaining;
}
