"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setGuestResume, setGuestTokenForAttempt } from "@/lib/guest-token";
import { useJoinSession } from "../hooks/use-join-session";
import { JoinFormSchema } from "../schemas";
import type { JoinSessionPayload, JoinFormInput, SessionPreview } from "../schemas";
import type { JoinSessionResult } from "@/lib/api/types/sessions";

type Phase = "form" | "revealed";

export function JoinView({ token, preview }: { token: string; preview: SessionPreview }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("form");
  const [joined, setJoined] = useState<JoinSessionResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<JoinFormInput>({
    resolver: zodResolver(JoinFormSchema),
    defaultValues: { name: "", email: "", candidateNumber: "", pin: "" },
  });

  const mutation = useJoinSession(
    token,
    (result) => {
      // Persist immediately (ADR-005: lost token = cannot resume), then reveal.
      for (const attempt of result.attempts) {
        setGuestTokenForAttempt(attempt.id, result.participantToken);
      }
      setGuestResume(token, {
        participantName: result.participant.name,
        attemptIds: result.attempts.map((attempt) => attempt.id),
      });
      setJoined(result);
      setPhase("revealed");
    },
    (message) => {
      if (form.getValues("pin")) {
        form.setError("pin", { message });
        return;
      }
      toast.error(message);
    },
  );

  const firstAttempt = joined?.attempts[0];

  const copyToken = async () => {
    if (!joined) return;
    await navigator.clipboard.writeText(joined.participantToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Isi Data Diri</CardTitle>
        <CardDescription>Data ini dipakai untuk identitas pada laporan hasil tes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase === "form" ? (
          <form
            onSubmit={form.handleSubmit(
              (values) => mutation.mutateAsync(values as JoinSessionPayload),
              () => toast.error("Periksa kembali field yang bertanda merah."),
            )}
            noValidate
            className="grid gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="join-name">Nama lengkap</FieldLabel>
                  <Input
                    {...field}
                    id="join-name"
                    placeholder="Nama Anda"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="join-email">Email (opsional)</FieldLabel>
                  <Input
                    {...field}
                    id="join-email"
                    type="email"
                    placeholder="nama@email.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="candidateNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="join-number">Nomor peserta (opsional)</FieldLabel>
                  <Input
                    {...field}
                    id="join-number"
                    placeholder="Contoh: 07"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {preview.requiresPin && (
              <Controller
                name="pin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="join-pin">PIN sesi</FieldLabel>
                    <Input
                      {...field}
                      id="join-pin"
                      inputMode="numeric"
                      placeholder="4–8 angka"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>Minta PIN ke penyelenggara sesi.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Memproses..." : "Gabung Sesi"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4" data-testid="token-reveal">
            <p className="text-sm text-muted-foreground">
              Simpan token di bawah ini. Token dibutuhkan untuk melanjutkan tes jika halaman
              tertutup.
            </p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
              <code
                className="min-w-0 flex-1 truncate font-mono text-sm"
                data-testid="participant-token"
              >
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
                {copied ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )}
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
            <Button
              className="w-full"
              disabled={!saved}
              onClick={() => firstAttempt && router.push(`/tes/${firstAttempt.id}`)}
            >
              Mulai Tes
            </Button>
          </div>
        )}
      </CardContent>
      {phase === "form" && (
        <CardFooter className="text-xs text-muted-foreground">
          Pastikan data benar sebelum melanjutkan.
        </CardFooter>
      )}
    </Card>
  );
}
