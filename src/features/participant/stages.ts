import type { AttemptStatus, ResultStatus } from "@/lib/api/types";

/**
 * The stage a participant can name. "Menunggu review" is an attempt status
 * plus a result status, so the API filters by stage and the UI never has to
 * join the two.
 */
export const PARTICIPANT_STAGES = [
  "IN_PROGRESS",
  "AWAITING_REVIEW",
  "APPROVED",
  "RETURNED",
] as const;

export type ParticipantStage = (typeof PARTICIPANT_STAGES)[number];

export const PARTICIPANT_STAGE_LABEL: Record<ParticipantStage, string> = {
  IN_PROGRESS: "Dikerjakan",
  AWAITING_REVIEW: "Menunggu review",
  APPROVED: "Hasil terbit",
  RETURNED: "Dikembalikan",
};

/**
 * `null` means the attempt is done but scoring has not written a result yet —
 * it is still waiting on the psychologist, so it belongs with "menunggu review"
 * rather than disappearing from the table.
 */
export function stageOf(item: {
  status: AttemptStatus;
  resultStatus: ResultStatus | null;
}): ParticipantStage | null {
  if (item.status === "IN_PROGRESS") return "IN_PROGRESS";
  if (item.status === "ABANDONED") return null;

  switch (item.resultStatus) {
    case "APPROVED":
      return "APPROVED";
    case "RETURNED":
      return "RETURNED";
    default:
      return "AWAITING_REVIEW";
  }
}
