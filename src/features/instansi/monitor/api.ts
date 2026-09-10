import { apiFetch } from "@/lib/api/client";
import type { SessionAttemptsSummary } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface InstansiOverview {
  employees: number;
  sessions: number;
  attempts: SessionAttemptsSummary;
}

export function fetchInstansiOverview(): Promise<ApiSuccess<InstansiOverview>> {
  return apiFetch<InstansiOverview>("/instansi/overview");
}
