import { Badge } from "@/components/ui/badge";
import type { ReportFormData } from "@/lib/api/types";

const TEST_STATUS_LABEL: Record<string, string> = {
  APPROVED: "Disetujui",
  PENDING_REVIEW: "Menunggu review",
  RETURNED: "Dikembalikan",
  NOT_SUBMITTED: "Belum dikerjakan",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

/** Identity block — exactly what the PDF header will print. */
export function ReportIdentity({ form }: { form: ReportFormData }) {
  const { participant, session, tests } = form;

  return (
    <section className="rounded-lg border p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Nama peserta" value={participant.name} />
        <Field label="Usia" value={participant.age === null ? "-" : `${participant.age} tahun`} />
        <Field label="Pendidikan" value={participant.education ?? "-"} />
        <Field label="Tujuan negara" value={participant.destination ?? "-"} />
      </div>
      <div className="mt-4 border-t pt-3">
        <p className="text-xs text-muted-foreground">Sesi</p>
        <p className="text-sm font-medium">{session.title}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {tests.map((test) => (
            <li key={test.testName}>
              <Badge variant={test.status === "APPROVED" ? "secondary" : "outline"}>
                {test.testName} · {TEST_STATUS_LABEL[test.status] ?? test.status}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
