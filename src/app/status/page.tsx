import { Badge } from "@/components/ui/badge";

/**
 * Smoke page for T0.2: exercises the server-side path to the backend.
 * The health endpoint bypasses the response envelope (raw `{status, db}`).
 */
export const dynamic = "force-dynamic";

interface HealthResponse {
  status: "ok" | "error";
  db: "up" | "down";
}

async function fetchHealth(): Promise<{ ok: boolean; body: HealthResponse | null }> {
  const base = process.env.API_INTERNAL_URL ?? "http://localhost:4000";
  try {
    const response = await fetch(`${base}/api/v1/health`, { cache: "no-store" });
    return { ok: response.ok, body: (await response.json()) as HealthResponse };
  } catch {
    return { ok: false, body: null };
  }
}

export default async function StatusPage() {
  const health = await fetchHealth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-semibold">Status Sistem</h1>
      {health.body ? (
        <div className="flex items-center gap-3 text-sm">
          <Badge variant={health.body.status === "ok" ? "default" : "destructive"}>
            Backend: {health.body.status}
          </Badge>
          <Badge variant={health.body.db === "up" ? "default" : "destructive"}>
            Database: {health.body.db === "up" ? "tersambung" : "terputus"}
          </Badge>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Backend tidak terjangkau. Pastikan API berjalan di{" "}
          <code>{process.env.API_INTERNAL_URL ?? "http://localhost:4000"}</code>.
        </p>
      )}
    </main>
  );
}
