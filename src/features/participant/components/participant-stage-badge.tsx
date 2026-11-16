import { Badge } from "@/components/ui/badge";
import { PARTICIPANT_STAGE_LABEL, type ParticipantStage } from "../stages";

const STYLE: Record<ParticipantStage, string> = {
  // Blue = the participant still has work to do.
  IN_PROGRESS: "border-chart-1/40 bg-chart-1/15 text-foreground",
  // Gold = waiting on the psychologist, same accent as the admin queue.
  AWAITING_REVIEW: "border-chart-3/40 bg-chart-3/15 text-foreground",
  APPROVED: "border-transparent bg-primary text-primary-foreground",
  RETURNED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function ParticipantStageBadge({ stage }: { stage: ParticipantStage }) {
  return (
    <Badge variant="outline" className={STYLE[stage]}>
      {PARTICIPANT_STAGE_LABEL[stage]}
    </Badge>
  );
}
