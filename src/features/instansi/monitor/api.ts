import { apiFetch } from "@/lib/api/client";
import type { SessionAttemptsSummary } from "@/lib/api/types";
import type { SessionStatus } from "@/lib/api/types/enums";
import type { ApiSuccess } from "@/lib/api/types/pagination";

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

export function fetchInstansiOverview(): Promise<ApiSuccess<InstansiOverview>> {
  return apiFetch<InstansiOverview>("/instansi/overview");
}

export function fetchInstansiProgress(
  limit: number,
): Promise<ApiSuccess<InstansiSessionProgress>> {
  return apiFetch<InstansiSessionProgress>(
    `/instansi/stats/progress?limit=${limit}`,
  );
}
