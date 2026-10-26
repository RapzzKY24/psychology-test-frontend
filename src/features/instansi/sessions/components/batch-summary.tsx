import { formatIdr } from "@/lib/format/format-idr";
import type { InstansiTestOption } from "../api";

interface BatchSummaryProps {
  selectedTests: InstansiTestOption[];
  slots: number;
  totalAmount: number;
}

/** Per-test price list plus the prepaid total (Σ price × slots). */
export function BatchSummary({ selectedTests, slots, totalAmount }: BatchSummaryProps) {
  return (
    <div className="space-y-3">
      {selectedTests.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Pilih setidaknya satu tes dan tentukan jumlah peserta untuk melanjutkan.
        </p>
      ) : (
        <ul className="divide-y">
          {selectedTests.map((test) => (
            <li key={test.id} className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm">{test.name}</span>
              <span className="text-muted-foreground text-sm tabular-nums">
                {formatIdr(test.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end justify-between gap-3 border-t pt-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase">Total</p>
          <p className="text-muted-foreground text-xs">
            {selectedTests.length} tes × {slots} peserta
          </p>
        </div>
        <p className="font-heading text-xl font-semibold tabular-nums">{formatIdr(totalAmount)}</p>
      </div>
    </div>
  );
}
