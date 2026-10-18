"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  clearGuestResume,
  getGuestResumeRaw,
  parseGuestResume,
  subscribeGuestResume,
} from "@/lib/guest-token";
import { ResumeSessionView } from "./resume-session-view";

/**
 * Shows a one-tap resume card when this device already holds a seat for the
 * session, otherwise renders the normal join/roster flow. Reads localStorage
 * via `useSyncExternalStore` so SSR and hydration stay consistent (server
 * snapshot is null).
 */
export function SessionGate({ token, children }: { token: string; children: React.ReactNode }) {
  const raw = useSyncExternalStore(
    subscribeGuestResume,
    () => getGuestResumeRaw(token),
    () => null,
  );
  const resume = useMemo(() => parseGuestResume(raw), [raw]);
  const [dismissed, setDismissed] = useState(false);

  if (!dismissed && resume && resume.attemptIds.length > 0) {
    return (
      <ResumeSessionView
        resume={resume}
        onDismiss={() => {
          clearGuestResume(token);
          setDismissed(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
