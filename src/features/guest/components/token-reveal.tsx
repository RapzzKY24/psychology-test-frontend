"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TokenRevealProps {
  token: string;
  onStart: () => void;
}

/** One-time token display — the participant must copy it before starting. */
export function TokenReveal({ token, onStart }: TokenRevealProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4" data-testid="token-reveal">
      <p className="text-sm text-muted-foreground">
        Simpan token di bawah ini. Token dibutuhkan untuk melanjutkan tes jika halaman tertutup.
      </p>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
        <code className="min-w-0 flex-1 truncate font-mono text-sm" data-testid="participant-token">
          {token}
        </code>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 shrink-0"
          aria-label="Salin token"
          onClick={() => {
            void copy();
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
      <Button className="w-full" disabled={!saved} onClick={onStart}>
        Mulai Tes
      </Button>
    </div>
  );
}
