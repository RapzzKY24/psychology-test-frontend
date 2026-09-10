"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
  const nameById = new Map(available.map((seat) => [seat.id, seat.name]));

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
                <FieldLabel htmlFor="roster-name">Nama peserta</FieldLabel>
                <Combobox
                  value={selectedId}
                  onValueChange={(value: string | null) => {
                    setSelectedId(value);
                    setPickError(null);
                  }}
                  itemToStringLabel={(id: string) => nameById.get(id) ?? ""}
                >
                  <ComboboxInput
                    id="roster-name"
                    placeholder={`Pilih dari ${available.length} nama...`}
                    disabled={mutation.isPending}
                    aria-invalid={Boolean(pickError)}
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxEmpty>Tidak ada nama yang cocok.</ComboboxEmpty>
                      {available.map((seat) => (
                        <ComboboxItem key={seat.id} value={seat.id}>
                          {seat.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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
