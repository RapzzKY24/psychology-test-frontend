import { apiFetchServer } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiOverview } from "./api";

/** Server-only fetchers for the instansi monitor feature (RSC pages). */
export function fetchInstansiOverviewServer(): Promise<ApiSuccess<InstansiOverview>> {
  return apiFetchServer<InstansiOverview>("/instansi/overview");
}
