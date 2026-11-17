import { BadgeCheck, Building2 } from "lucide-react";
import type { PublicPsychologist } from "@/lib/api/types";

/**
 * Who stands behind the report. The catalog has no test→psychologist link, so
 * this names the psychologists who sign reports instead of pretending each test
 * has one particular author.
 */
export function TestPsychologistCard({ psychologists }: { psychologists: PublicPsychologist[] }) {
  if (psychologists.length === 0) return null;

  return (
    <section aria-labelledby="psikolog" className="space-y-4">
      <div className="space-y-1">
        <h2 id="psikolog" className="text-lg font-semibold">
          Psikolog Berlisensi
        </h2>
        <p className="text-muted-foreground text-sm">
          Hasil Anda diperiksa dan disetujui oleh psikolog berikut.
        </p>
      </div>

      <ul className="divide-y overflow-hidden rounded-2xl border">
        {psychologists.map((psychologist) => {
          const credentials = [
            psychologist.degree,
            `STR/SIK ${psychologist.licenseNumber}`,
            psychologist.sippNumber ? `SIPP ${psychologist.sippNumber}` : null,
          ]
            .filter((part): part is string => !!part)
            .join(" · ");

          return (
            <li key={psychologist.licenseNumber} className="flex items-start gap-4 p-5">
              <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <BadgeCheck className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="font-medium">{psychologist.fullName}</p>
                <p className="text-muted-foreground text-sm">{credentials}</p>
                {psychologist.institutionName ? (
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Building2 className="size-3.5 shrink-0" aria-hidden />
                    {psychologist.institutionName}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
