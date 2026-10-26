import { Clock, FileText, Layers } from "lucide-react";
import { TEST_CATEGORY_LABELS, type PublicTest } from "@/lib/api/types";

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="bg-card flex items-center gap-3 p-4">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

/** Three-cell summary strip — the facts people scan for before reading on. */
export function TestFacts({ test }: { test: PublicTest }) {
  return (
    <div className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
      <Fact icon={Clock} label="Durasi" value={`${test.estimatedDurationMin} menit`} />
      <Fact icon={Layers} label="Kategori" value={TEST_CATEGORY_LABELS[test.category]} />
      <Fact icon={FileText} label="Hasil" value="Laporan PDF + QR" />
    </div>
  );
}
