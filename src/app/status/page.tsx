import { Badge } from "@/components/ui/badge";
import { isApiError } from "@/lib/api/client";
import { apiFetchServer } from "@/lib/api/server";

/**
 * Smoke page for T0.2: exercises the server-side path to the backend.
 * `GET /health` is enveloped like every other endpoint and answers 503 when the
 * database is unreachable, which `apiFetchServer` surfaces as an `ApiError`.
 */
export const dynamic = "force-dynamic";

interface HealthResponse {
  status: "ok" | "error";
  db: "up" | "down";
}

type Health = { reachable: true; body: HealthResponse } | { reachable: false; dbDown: boolean };

async function fetchHealth(): Promise<Health> {
  try {
    const { data } = await apiFetchServer<HealthResponse>("/health");
    return { reachable: true, body: data };
  } catch (error) {
    // 503 is the controller's "Database unreachable"; anything else means the
    // request never got an answer at all.
    return { reachable: false, dbDown: isApiError(error) && error.statusCode === 503 };
  }
}

export default async function StatusPage() {
  const health = await fetchHealth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-semibold">Status Sistem</h1>
      {health.reachable ? (
        <div className="flex items-center gap-3 text-sm">
          <Badge variant={health.body.status === "ok" ? "default" : "destructive"}>
            Backend: {health.body.status}
          </Badge>
          <Badge variant={health.body.db === "up" ? "default" : "destructive"}>
            Database: {health.body.db === "up" ? "tersambung" : "terputus"}
          </Badge>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          {health.dbDown
            ? "Backend merespons, tetapi database tidak tersambung."
            : "Backend tidak terjangkau. Pastikan API berjalan (cek API_INTERNAL_URL)."}
        </p>
      )}
    </main>
  );
}
