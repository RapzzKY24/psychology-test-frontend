"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Copies an arbitrary value (e.g. a VA number) to the clipboard. */
export function CopyValueButton({
  value,
  label = "Salin",
  toastMessage = "Disalin.",
}: {
  value: string;
  label?: string;
  toastMessage?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(toastMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin — salin manual: " + value);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {label}
    </Button>
  );
}
