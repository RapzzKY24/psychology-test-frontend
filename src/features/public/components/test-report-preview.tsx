import { QrCode } from "lucide-react";

/**
 * A miniature of the report the buyer receives, drawn in markup rather than
 * shipped as an image: it stays sharp, follows the theme, and cannot go stale
 * against the PDF template the way a screenshot would.
 *
 * Every value is redacted — the shape of the document is the point, not the
 * numbers. The mock itself is hidden from assistive tech; the caption and the
 * list beside it carry the information.
 */

const RATING_COLUMNS = ["R", "K", "C", "B", "T"] as const;

/** One aspect row: a redacted label and the column the psychologist ticked. */
const ROWS: { width: string; mark: number }[] = [
  { width: "w-24", mark: 3 },
  { width: "w-20", mark: 1 },
  { width: "w-28", mark: 4 },
];

function Redacted({ className = "" }: { className?: string }) {
  return <span className={`bg-foreground/15 inline-block h-1.5 rounded-full ${className}`} />;
}

function Field({ label, width }: { label: string; width: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-[72px] shrink-0">{label}</span>
      <span className="text-muted-foreground/60">:</span>
      <Redacted className={width} />
    </div>
  );
}

export function TestReportPreview() {
  return (
    <figure className="space-y-2">
      <div
        aria-hidden
        className="bg-card ring-foreground/5 rounded-md border p-4 shadow-sm ring-1"
      >
        <div className="text-muted-foreground flex items-center justify-between text-[8px] font-semibold tracking-wider uppercase">
          <span>mypsikolog.id</span>
          <span className="border-foreground/20 rounded border px-1 py-px">Rahasia</span>
        </div>

        <div className="border-foreground/10 mt-2 border-t pt-3">
          <p className="text-[13px] leading-tight font-semibold">
            Laporan Hasil
            <br />
            Pemeriksaan Psikologi
          </p>
          <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-[8px]">
            <span>Nomor laporan</span>
            <Redacted className="w-16" />
          </div>
        </div>

        <div className="text-[8px] leading-relaxed">
          <div className="mt-3 space-y-1">
            <Field label="Nama" width="w-24" />
            <Field label="Usia" width="w-8" />
            <Field label="Pendidikan" width="w-20" />
          </div>

          <table className="mt-3 w-full border-collapse">
            <thead>
              <tr className="text-muted-foreground border-foreground/10 border-y">
                <th className="py-1 text-left font-medium">Aspek yang dinilai</th>
                {RATING_COLUMNS.map((column) => (
                  <th key={column} className="w-4 py-1 text-center font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.width} className="border-foreground/5 border-b">
                  <td className="py-1.5">
                    <Redacted className={row.width} />
                  </td>
                  {RATING_COLUMNS.map((column, index) => (
                    <td key={column} className="py-1.5 text-center">
                      {index === row.mark ? (
                        <span className="text-foreground font-semibold">X</span>
                      ) : (
                        <span className="text-foreground/20">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <p className="text-[8px] font-semibold">Kesimpulan</p>
          <div className="mt-1 space-y-1">
            <Redacted className="w-full" />
            <Redacted className="w-11/12" />
          </div>
        </div>

        <div className="border-foreground/10 mt-3 flex items-end justify-between gap-3 border-t pt-2.5">
          <div className="text-[8px] leading-relaxed">
            <Field label="Tanda tangan" width="w-14" />
            <Field label="Nama psikolog" width="w-20" />
            <Field label="No. STR/SIK" width="w-16" />
          </div>
          <span className="border-foreground/15 flex size-8 shrink-0 items-center justify-center rounded border">
            <QrCode className="text-foreground/50 size-6" strokeWidth={1.5} />
          </span>
        </div>
      </div>
      <figcaption className="text-muted-foreground text-center text-xs">
        Contoh halaman laporan — data peserta dan hasil disamarkan.
      </figcaption>
    </figure>
  );
}
