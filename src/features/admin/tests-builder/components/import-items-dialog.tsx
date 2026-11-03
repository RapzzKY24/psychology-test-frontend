"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { parseRightWrongImport } from "../parse-import";
import type { RightWrongItemContentInput } from "../schemas";

const PLACEHOLDER = `2 + 3 = ? | 4 | 5 | 6 | 7 | B
Lawan kata "Besar" | Kecil | Luas | Tinggi | Lebar | A`;

/**
 * Paste-to-items for a right/wrong test: one line per question, pipe separated.
 * Nothing is written until the whole paste parses — a broken line on row 12
 * keeps the other rows out of the draft too.
 */
export function ImportItemsDialog({
  onImport,
  children,
}: {
  onImport: (items: RightWrongItemContentInput[]) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const parsed = useMemo(() => parseRightWrongImport(text), [text]);
  const blocked = parsed.errors.length > 0 || parsed.items.length === 0;

  const close = () => {
    setOpen(false);
    setText("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setText("");
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import soal</DialogTitle>
          <DialogDescription>
            Satu soal per baris: pertanyaan, opsi, lalu kunci — dipisah tanda <code>|</code>. Kunci
            boleh huruf opsi (A–F) atau teks opsinya langsung.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={PLACEHOLDER}
            className="min-h-48 font-mono text-xs"
            aria-label="Teks soal yang akan diimpor"
          />

          {parsed.errors.length > 0 && (
            <ul className="space-y-1 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {parsed.errors.slice(0, 5).map((error) => (
                <li key={error}>{error}</li>
              ))}
              {parsed.errors.length > 5 && <li>… dan {parsed.errors.length - 5} baris lain.</li>}
            </ul>
          )}

          {!blocked && (
            <p className="text-sm text-muted-foreground">
              {parsed.items.length} soal siap ditambahkan di akhir daftar.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={close}>
            Batal
          </Button>
          <Button
            type="button"
            disabled={blocked}
            onClick={() => {
              onImport(parsed.items);
              close();
            }}
          >
            {parsed.items.length > 0 ? `Import ${parsed.items.length} soal` : "Import soal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
