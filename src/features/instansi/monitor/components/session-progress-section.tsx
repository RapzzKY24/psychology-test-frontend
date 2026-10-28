import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionProgressChart } from "./session-progress-chart";
import type { SessionProgressItem } from "../types";

export function SessionProgressSection({ sessions }: { sessions: SessionProgressItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progres peserta per sesi</CardTitle>
        <CardDescription>
          Sesi terbaru: berapa peserta sudah selesai, masih mengerjakan, belum mulai,
          dan berapa slot yang masih kosong.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SessionProgressChart sessions={sessions} />
      </CardContent>
    </Card>
  );
}
