import type { Education, Gender, MeProfileLastAttempt } from "@/lib/api/types";

const GENDER_LABEL: Record<Gender, string> = {
  MALE: "Laki-laki",
  FEMALE: "Perempuan",
};

const EDUCATION_LABEL: Record<Education, string> = {
  SMP_SMA: "SMP / SMA",
  S1: "S1",
  UMUM: "Umum",
};

/** `YYYY-MM-DD` from the API — formatted in UTC so the day never shifts. */
function formatBirthDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

/**
 * Read-only: these values belong to the attempt that used them, not to the
 * account. Copying them into the profile would create a second source of truth.
 */
export function ProfileDeclarations({ attempt }: { attempt: MeProfileLastAttempt | null }) {
  if (!attempt) {
    return (
      <p className="text-sm text-muted-foreground">
        Data ini terisi otomatis saat Anda memulai tes pertama.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <dl className="grid gap-4 sm:grid-cols-2">
        <Row label="Tanggal lahir" value={formatBirthDate(attempt.birthDate)} />
        <Row label="Jenis kelamin" value={attempt.gender ? GENDER_LABEL[attempt.gender] : "—"} />
        <Row
          label="Pendidikan terakhir"
          value={attempt.education ? EDUCATION_LABEL[attempt.education] : "—"}
        />
        <Row label="Dari tes terakhir" value={attempt.testName} />
      </dl>
      <p className="text-xs text-muted-foreground">
        Dicatat saat tes dimulai dan tidak bisa diubah dari halaman ini, supaya norma yang dipakai
        tetap sama dengan yang Anda kerjakan.
      </p>
    </div>
  );
}
