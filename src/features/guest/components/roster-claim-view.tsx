"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { setGuestResume, setGuestTokenForAttempt } from "@/lib/guest-token";
import { useClaimSeat } from "../hooks/use-claim-seat";
import type { RosterSeat } from "../schemas";

/** Roster sessions: employee picks their pre-registered name, no typing. */
export function RosterClaimView({ token, roster }: { token: string; roster: RosterSeat[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);

  // No token-save screen: the token is persisted to localStorage automatically
  // and claim is idempotent — picking the name again re-issues access.
  // On success we go straight to the first attempt.

  const mutation = useClaimSeat(
    token,
    (result) => {
      for (const attempt of result.attempts) {
        setGuestTokenForAttempt(attempt.id, result.participantToken);
      }
      const first = result.attempts[0];
      if (!first) {
        toast.error("Sesi ini belum memiliki tes — hubungi penyelenggara.");
        return;
      }
      setGuestResume(token, {
        participantName: result.participant.name,
        attemptIds: result.attempts.map((attempt) => attempt.id),
      });
      router.push(`/tes/kerjakan/${first.id}`);
    },
    (error) => {
      if (isApiError(error) && error.code === "seat_claimed") {
        toast.error(error.message);
        // The seat was taken on another device — refresh so it leaves the list.
        router.refresh();
        return;
      }
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  );

  const available = roster.filter((seat) => !seat.claimed);
  const nameById = new Map(available.map((seat) => [seat.id, seat.name]));
  const lockMessage = isApiError(mutation.error) ? mutation.error.message : null;

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
                filter={(id: string, query: string) =>
                  (nameById.get(id) ?? "").toLowerCase().includes(query.trim().toLowerCase())
                }
              >
                <ComboboxInput
                  id="roster-name"
                  placeholder={`Pilih dari ${available.length} nama...`}
                  disabled={mutation.isPending}
                  aria-invalid={Boolean(pickError)}
                  className="h-12 text-base"
                />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxEmpty>Tidak ada nama yang cocok.</ComboboxEmpty>
                    {available.map((seat) => (
                      <ComboboxItem key={seat.id} value={seat.id} className="py-3 text-base">
                        {seat.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {pickError && <FieldError>{pickError}</FieldError>}
            </Field>
          )}

          {lockMessage && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{lockMessage}</span>
            </div>
          )}

          <Button
            type="button"
            disabled={mutation.isPending || available.length === 0}
            onClick={submit}
            className="h-12 w-full text-base"
          >
            {mutation.isPending ? "Memproses..." : "Pilih & Mulai"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Nama tidak ada di daftar atau sudah dipakai di HP lain? Hubungi petugas penyelenggara.
      </CardFooter>
    </Card>
  );
}
