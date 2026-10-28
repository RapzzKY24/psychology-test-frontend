"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { setGuestResume, setGuestTokenForAttempt } from "@/lib/guest-token";
import { useJoinSession } from "../hooks/use-join-session";
import { JoinFormSchema } from "../schemas";
import type { JoinSessionPayload, JoinFormInput, SessionPreview } from "../schemas";
import type { JoinSessionResult } from "@/lib/api/types/sessions";
import { JoinForm } from "./join-form";
import { TokenReveal } from "./token-reveal";

type Phase = "form" | "revealed";

export function JoinView({ token, preview }: { token: string; preview: SessionPreview }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("form");
  const [joined, setJoined] = useState<JoinSessionResult | null>(null);

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

  const submit = form.handleSubmit(
    (values) => mutation.mutateAsync(values as JoinSessionPayload),
    () => toast.error("Periksa kembali field yang bertanda merah."),
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Isi Data Diri</CardTitle>
        <CardDescription>Data ini dipakai untuk identitas pada laporan hasil tes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase === "form" ? (
          <JoinForm
            form={form}
            requiresPin={preview.requiresPin}
            isPending={mutation.isPending}
            onSubmit={submit}
          />
        ) : (
          <TokenReveal
            token={joined?.participantToken ?? ""}
            onStart={() => firstAttempt && router.push(`/tes/kerjakan/${firstAttempt.id}`)}
          />
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
