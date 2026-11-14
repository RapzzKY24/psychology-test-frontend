"use client";

import { createContext, useContext, useId, useMemo, useState, useSyncExternalStore } from "react";
import { CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ageInMonths,
  checkAgeBand,
  formatAge,
  formatAgeBand,
  parseIsoDate,
  type AgeBand,
  type AgeBandStatus,
} from "@/lib/age";
import type { UserRole } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface AgeGateState {
  band: AgeBand | null;
  birthDate: string;
  setBirthDate: (value: string) => void;
  ageMonths: number | null;
  status: AgeBandStatus;
  /** Today as `YYYY-MM-DD`; empty until the client mounts. */
  todayIso: string;
}

const NOOP = () => {};
const UNGATED: AgeGateState = {
  band: null,
  birthDate: "",
  setBirthDate: NOOP,
  ageMonths: null,
  status: "unknown",
  todayIso: "",
};

const AgeGateContext = createContext<AgeGateState | null>(null);

function localIsoDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

const subscribeToNothing = () => () => {};

/**
 * Shares one birth date between the gate card and every buy button on the page,
 * so the sidebar CTA and the mobile bar agree without lifting state into the
 * server-rendered detail view.
 */
export function AgeGateProvider({
  band,
  children,
}: {
  band: AgeBand | null;
  children: React.ReactNode;
}) {
  const [birthDate, setBirthDate] = useState("");
  // Server snapshot is empty, client snapshot is today: the server and the
  // browser can sit on different days, and rendering a date on both sides would
  // break hydration.
  const todayIso = useSyncExternalStore(
    subscribeToNothing,
    () => localIsoDate(new Date()),
    () => "",
  );

  const value = useMemo<AgeGateState>(() => {
    if (!band) return { ...UNGATED, birthDate, setBirthDate, todayIso };
    const birth = parseIsoDate(birthDate);
    const today = parseIsoDate(todayIso);
    const ageMonths = birth && today ? ageInMonths(birth, today) : null;
    const status: AgeBandStatus =
      ageMonths === null || ageMonths < 0 ? "unknown" : checkAgeBand(ageMonths, band);
    return { band, birthDate, setBirthDate, ageMonths, status, todayIso };
  }, [band, birthDate, todayIso]);

  return <AgeGateContext.Provider value={value}>{children}</AgeGateContext.Provider>;
}

/** Ungated pages (catalog, tests without a band) fall back to the open state. */
export function useAgeGate(): AgeGateState {
  return useContext(AgeGateContext) ?? UNGATED;
}

const TONE: Record<Exclude<AgeBandStatus, "unknown">, string> = {
  inside: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
  below: "border-destructive/30 bg-destructive/5 text-destructive",
  above: "border-destructive/30 bg-destructive/5 text-destructive",
};

function statusMessage(status: AgeBandStatus, ageMonths: number | null, band: AgeBand) {
  if (status === "unknown" || ageMonths === null) return null;
  if (status === "inside") {
    return `Usia ${formatAge(ageMonths)} — sesuai dengan norma tes ini.`;
  }
  const side = status === "below" ? "di bawah" : "di atas";
  return `Usia ${formatAge(ageMonths)} — ${side} rentang norma (${formatAgeBand(band)}). Hasil IQ tidak berlaku untuk usia ini.`;
}

/**
 * Age check above the buy panel. The norm ladders shipped so far cover one age
 * band (CFIT 2: 14y0m–14y11m), so buying without checking would produce an IQ
 * that does not apply. Institutions buy in bulk for a roster, so they only get
 * the note — the gate applies to personal purchases.
 */
export function AgeGateCard({ role, className }: { role: UserRole | null; className?: string }) {
  const { band, birthDate, setBirthDate, ageMonths, status, todayIso } = useAgeGate();
  const inputId = useId();
  if (!band) return null;

  const institutional = role === "INSTANSI";
  const message = institutional ? null : statusMessage(status, ageMonths, band);

  return (
    <section className={cn("rounded-2xl border p-4", className)}>
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <CalendarCheck className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">Kesesuaian usia</p>
          <p className="text-muted-foreground text-sm">
            Norma tes ini berlaku untuk usia {formatAgeBand(band)}.
          </p>
        </div>
      </div>

      {institutional ? (
        <p className="text-muted-foreground mt-4 text-sm">
          Pastikan seluruh peserta dalam rentang usia tersebut sebelum sesi dijalankan.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor={inputId}>Tanggal lahir peserta</Label>
            <Input
              id={inputId}
              type="date"
              value={birthDate}
              max={todayIso || undefined}
              onChange={(event) => setBirthDate(event.target.value)}
            />
          </div>
          {message && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                TONE[status as keyof typeof TONE],
              )}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
