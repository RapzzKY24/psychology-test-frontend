import type { SessionAttemptsSummary } from "@/lib/api/types";
import type { SessionStatus } from "@/lib/api/types/enums";

export interface InstansiOverview {
  employees: number;
  sessions: number;
  attempts: SessionAttemptsSummary;
}

export interface SessionProgressItem {
  sessionId: string;
  title: string;
  status: SessionStatus;
  slotLimit: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  empty: number;
}

export interface InstansiSessionProgress {
  sessions: SessionProgressItem[];
}
