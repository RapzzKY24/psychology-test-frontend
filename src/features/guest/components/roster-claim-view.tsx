"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Copy } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [comboOpen, setComboOpen] = useState(false);

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
  const selected = available.find((seat) => seat.id === selectedId) ?? null;

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
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboOpen}
                      aria-label="Pilih nama Anda"
                      disabled={mutation.isPending}
                      className="h-11 w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {selected?.name ?? `Pilih dari ${available.length} nama...`}
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <div className="border-b p-2">
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik untuk mencari..."
                        aria-label="Cari nama"
                        className="h-9 border-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                      {visible.length === 0 ? (
                        <p className="p-3 text-sm text-muted-foreground">
                          Tidak ada nama yang cocok dengan “{query.trim()}”.
                        </p>
                      ) : (
                        visible.map((seat) => (
                          <button
                            key={seat.id}
                            type="button"
                            role="option"
                            aria-selected={selectedId === seat.id}
                            disabled={mutation.isPending}
                            onClick={() => {
                              setSelectedId(seat.id);
                              setPickError(null);
                              setComboOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                          >
                            <Check
                              className={
                                selectedId === seat.id
                                  ? "size-4 shrink-0 opacity-100"
                                  : "size-4 shrink-0 opacity-0"
                              }
                              aria-hidden
                            />
                            {seat.name}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
