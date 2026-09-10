"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setGuestTokenForAttempt } from "@/lib/guest-token";
import type { JoinSessionResult } from "@/lib/api/types/sessions";
import { useClaimSeat } from "../hooks/use-claim-seat";
import type { RosterSeat } from "../schemas";

type Phase = "pick" | "revealed";

/** Roster sessions: employee picks their pre-registered name, no typing. */
export function RosterClaimView({
  token,
  roster,
}: {
  token: string;
  roster: RosterSeat[];
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("pick");
  const [joined, setJoined] = useState<JoinSessionResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const mutation = useClaimSeat(
    token,
    (result) => {
      for (const attempt of result.attempts) {
        setGuestTokenForAttempt(attempt.id, result.participantToken);
      }
      setJoined(result);
      setPhase("revealed");
    },
    (message) => toast.error(message),
  );

  const firstAttempt = joined?.attempts[0];
  const available = roster.filter((seat) => !seat.claimed);
  const q = query.trim().toLowerCase();
  const visible =
    q.length === 0
      ? available
      : available.filter((seat) => seat.name.toLowerCase().includes(q));

  const copyToken = async () => {
    if (!joined) return;
    await navigator.clipboard.writeText(joined.participantToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submit = () => {
    if (!selectedId) {
      setPickError("Pilih nama Anda dari daftar.");
      return;
    }
    setPickError(null);
    mutation.mutate(selectedId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pilih Nama Anda</CardTitle>
        <CardDescription>
          Data sudah diisi institusi — cukup pilih nama, langsung tes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase === "pick" ? (
          <div className="grid gap-4">
            {available.length === 0 ? (
              <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                Semua nama sudah diklaim. Hubungi penyelenggara sesi.
              </p>
            ) : (
              <Field data-invalid={Boolean(pickError)}>
                <FieldLabel>Nama peserta</FieldLabel>
                {available.length > 5 && (
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Cari dari ${available.length} nama...`}
                      aria-label="Cari nama"
                      className="h-11 pl-9"
                    />
                  </div>
                )}
                <div className="grid max-h-64 gap-1 overflow-y-auto rounded-lg border p-2">
                  {visible.length === 0 ? (
                    <p className="p-2 text-sm text-muted-foreground">
                      Tidak ada nama yang cocok dengan “{query.trim()}”.
                    </p>
                  ) : (
                    visible.map((seat) => (
                      <label
                        key={seat.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedId === seat.id}
                          disabled={mutation.isPending}
                          onCheckedChange={(checked) =>
                            setSelectedId(checked === true ? seat.id : null)
                          }
                          aria-label={seat.name}
                        />
                        {seat.name}
                      </label>
                    ))
                  )}
                </div>
                {pickError && <FieldError>{pickError}</FieldError>}
              </Field>
            )}
            <Button
              type="button"
              disabled={mutation.isPending || available.length === 0}
              onClick={submit}
              className="h-11 w-full"
            >
              {mutation.isPending ? "Memproses..." : "Pilih & Mulai"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4" data-testid="token-reveal">
            <p className="text-sm text-muted-foreground">
              Simpan token di bawah ini. Token dibutuhkan untuk melanjutkan tes jika halaman tertutup.
            </p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
              <code className="min-w-0 flex-1 truncate font-mono text-sm" data-testid="participant-token">
                {joined?.participantToken}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Salin token"
                onClick={() => {
                  void copyToken();
                }}
              >
                {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </Button>
            </div>
            <label className="flex items-center gap-2.5 rounded-lg border p-3 text-sm">
              <Checkbox
                checked={saved}
                onCheckedChange={(checked) => setSaved(checked === true)}
                aria-label="Saya sudah menyimpan token"
              />
              Saya sudah menyimpan token
            </label>
            <Button className="h-11 w-full" disabled={!saved} onClick={() => firstAttempt && router.push(`/tes/${firstAttempt.id}`)}>
              Mulai Tes
            </Button>
          </div>
        )}
      </CardContent>
      {phase === "pick" && (
        <CardFooter className="text-xs text-muted-foreground">
          Nama tidak ada di daftar? Hubungi penyelenggara sesi.
        </CardFooter>
      )}
    </Card>
  );
}
