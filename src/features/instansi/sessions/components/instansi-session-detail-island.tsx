"use client";

import { SessionStats } from "@/components/shared/session-stats";
import { InstansiRosterPanel } from "@/features/instansi/sessions/components/instansi-roster-panel";
import { useInstansiSessionDetail } from "@/features/instansi/sessions/hooks/use-instansi-session-detail";
import type { InstansiSessionDetail } from "@/lib/api/types";

/** Client island for the instansi session detail: stats + roster editor. */
export function InstansiSessionDetailIsland({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: InstansiSessionDetail;
}) {
  const { data } = useInstansiSessionDetail(sessionId, initial);
  const { session, participants, attempts } = data;

  return (
    <div className="space-y-6">
      <SessionStats
        participants={participants.length}
        slotLimit={session.slotLimit}
        attempts={attempts}
      />

      <InstansiRosterPanel
        sessionId={sessionId}
        participants={participants}
        slotLimit={session.slotLimit}
        status={session.status}
      />
    </div>
  );
}
