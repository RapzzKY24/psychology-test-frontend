"use client";

import { useRouter } from "next/navigation";
import { PlayCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuestResume } from "@/lib/guest-token";

/** One-tap resume for a candidate who already claimed a seat on this device. */
export function ResumeSessionView({
  resume,
  onDismiss,
}: {
  resume: GuestResume;
  onDismiss: () => void;
}) {
  const router = useRouter();
  const firstAttempt = resume.attemptIds[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lanjutkan sebagai {resume.participantName}</CardTitle>
        <p className="text-muted-foreground text-sm">
          Anda sudah terdaftar di sesi ini. Lanjutkan tes tanpa memilih nama lagi.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="h-12 w-full text-base"
          disabled={!firstAttempt}
          onClick={() => firstAttempt && router.push(`/tes/kerjakan/${firstAttempt}`)}
        >
          <PlayCircle className="size-5" aria-hidden />
          Lanjutkan Tes
        </Button>
        <Button variant="ghost" className="w-full" onClick={onDismiss}>
          <UserRound className="size-4" aria-hidden />
          Bukan saya — pilih nama lain
        </Button>
      </CardContent>
    </Card>
  );
}
