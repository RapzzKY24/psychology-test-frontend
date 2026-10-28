import { apiFetchServer } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiOverview, InstansiSessionProgress } from "./types";

/** Server-only fetchers for the instansi monitor feature (RSC pages). */
export function fetchInstansiOverviewServer(): Promise<ApiSuccess<InstansiOverview>> {
  return apiFetchServer<InstansiOverview>("/instansi/overview");
}

export function fetchInstansiProgressServer(
  limit: number,
): Promise<ApiSuccess<InstansiSessionProgress>> {
  return apiFetchServer<InstansiSessionProgress>(
    `/instansi/stats/progress?limit=${limit}`,
    { revalidate: 60 },
  );
}
