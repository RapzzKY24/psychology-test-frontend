import type { ReactNode } from "react";
import { Brain, FileCheck, HeartPulse, ShieldCheck } from "lucide-react";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Diverifikasi psikolog berlisensi" },
  { icon: FileCheck, label: "Hasil dan sertifikat resmi" },
  { icon: HeartPulse, label: "Data Anda dijaga" },
] as const;

/**
 * Illustration panel. Built from icons rather than a photo so it stays crisp at
 * any size and does not depend on a crop that may cut a face.
 */
function AuthAside() {
  return (
    <aside className="bg-primary/5 relative hidden flex-col justify-between overflow-hidden border-r p-8 md:flex lg:p-10">
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute -top-20 -right-16 size-64 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full blur-3xl"
      />

      <div className="relative">
        <span className="border-primary/20 bg-background/80 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <ShieldCheck className="size-3.5" aria-hidden />
          Psikolog berlisensi
        </span>
        <h2 className="mt-6 text-2xl leading-tight font-semibold tracking-tight lg:text-3xl">
          Kenali diri,
          <br />
          satu langkah lebih dekat.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
          Tes dipandu psikolog berlisensi. Hasilnya dijelaskan dengan bahasa yang mudah dipahami.
        </p>
      </div>

      <div className="relative my-10 flex items-center justify-center" aria-hidden>
        <div className="bg-background relative flex size-44 items-center justify-center rounded-full border shadow-sm">
          <Brain className="text-primary size-20" strokeWidth={1.1} />
          <span className="bg-background absolute top-3 -left-5 flex size-11 items-center justify-center rounded-full border shadow-sm">
            <HeartPulse className="text-primary size-5" strokeWidth={1.6} />
          </span>
          <span className="bg-background absolute top-14 -right-4 flex size-10 items-center justify-center rounded-full border shadow-sm">
            <FileCheck className="text-primary size-4" strokeWidth={1.6} />
          </span>
          <span className="bg-background absolute -bottom-2 left-10 flex size-9 items-center justify-center rounded-full border shadow-sm">
            <ShieldCheck className="text-primary size-4" strokeWidth={2} />
          </span>
        </div>
      </div>

      <ul className="relative grid gap-3">
        {TRUST_POINTS.map(({ icon: Icon, label }) => (
          <li key={label} className="text-muted-foreground flex items-center gap-2.5 text-sm">
            <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-3.5" aria-hidden />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

interface AuthSplitCardProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Wide two-column auth shell: illustration on the left, the step/form on the
 * right. The single-column fallback keeps the form usable on phones.
 */
export function AuthSplitCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthSplitCardProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
      <div className="bg-card grid w-full max-w-6xl overflow-hidden rounded-3xl border shadow-sm md:grid-cols-[0.95fr_1.05fr]">
        <AuthAside />
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <header className="mb-6 space-y-2">
            {eyebrow ? (
              <p className="text-primary text-xs font-medium tracking-wide uppercase">{eyebrow}</p>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">
              {description}
            </p>
          </header>
          <div className="grid gap-5">{children}</div>
          {footer ? (
            <div className="text-muted-foreground mt-6 border-t pt-4 text-center text-sm">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
