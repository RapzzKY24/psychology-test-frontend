"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Copies the guest invite link for a session token (/join/<token>). */
export function CopyInviteButton({ token, label }: { token: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const link = `${window.location.origin}/join/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Tautan undangan disalin.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin — salin manual: " + link);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {label ?? "Salin Undangan"}
    </Button>
  );
}
