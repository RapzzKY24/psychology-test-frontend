"use client";

import { Button } from "@/components/ui/button";
import type { SessionSummary } from "@/lib/api/types";
import { CopyInviteButton } from "./copy-invite-button";

/** After-create panel — the invite link is shown once with a copy action. */
export function CreateSessionSuccess({
  created,
  onDone,
}: {
  created: SessionSummary;
  onDone: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/50 p-3 text-sm">
        <p>
          Sesi <span className="font-medium">{created.title}</span> dibuat. Salin tautan undangan
          dan bagikan ke peserta — peserta masuk lewat{" "}
          <code>/join/{created.token.slice(0, 6)}…</code>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <CopyInviteButton token={created.token} label="Salin Tautan" />
        <Button className="flex-1" onClick={onDone}>
          Selesai
        </Button>
      </div>
    </div>
  );
}
