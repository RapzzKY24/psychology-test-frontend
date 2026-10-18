"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/api/types";

interface EmployeePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  employees: Employee[];
  isLoading?: boolean;
  /** Employees already linked to the batch (hidden from the list). */
  excludeIds?: string[];
  mode: "multi" | "single";
  confirmLabel: string;
  pending?: boolean;
  onSubmit: (employeeIds: string[]) => void;
}

/**
 * Searchable roster picker used by both "tambah peserta" and "ganti peserta".
 * The body only mounts while the dialog is open, so its selection resets on
 * every close without a synchronising effect.
 */
export function EmployeePickerDialog(props: EmployeePickerDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {props.open && <EmployeePickerBody {...props} />}
      </DialogContent>
    </Dialog>
  );
}

function EmployeePickerBody({
  onOpenChange,
  title,
  description,
  employees,
  isLoading = false,
  excludeIds = [],
  mode,
  confirmLabel,
  pending = false,
  onSubmit,
}: EmployeePickerDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const options = useMemo(() => {
    const excluded = new Set(excludeIds);
    const term = query.trim().toLowerCase();
    return employees.filter(
      (e) =>
        !excluded.has(e.id) &&
        (term === "" ||
          e.name.toLowerCase().includes(term) ||
          e.idNumber.toLowerCase().includes(term)),
    );
  }, [employees, excludeIds, query]);

  const toggle = (id: string) => {
    if (mode === "single") {
      setSelected([id]);
      return;
    }
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className="relative">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau NIK…"
          className="pl-9"
          aria-label="Cari peserta"
        />
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-muted-foreground p-3 text-sm">Memuat…</p>
        ) : options.length === 0 ? (
          <p className="text-muted-foreground p-3 text-sm">Tidak ada peserta yang bisa dipilih.</p>
        ) : (
          options.map((employee) => {
            const checked = selected.includes(employee.id);
            return (
              <label
                key={employee.id}
                className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-3"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(employee.id)}
                  aria-label={employee.name}
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{employee.name}</span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {employee.idType}: {employee.idNumber}
                  </span>
                </span>
              </label>
            );
          })
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Batal
        </Button>
        <Button disabled={selected.length === 0 || pending} onClick={() => onSubmit(selected)}>
          {pending ? "Menyimpan…" : confirmLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
