import { formatIdr } from "@/lib/format/format-idr";

interface CheckoutSummaryProps {
  testNames: string[];
  amount: number;
}

/** What was bought and how much it costs. */
export function CheckoutSummary({ testNames, amount }: CheckoutSummaryProps) {
  return (
    <div className="w-full space-y-2 rounded-lg border bg-muted/40 p-3 text-left">
      <p className="text-muted-foreground text-xs uppercase">Tes</p>
      <ul className="space-y-1">
        {testNames.map((name) => (
          <li key={name} className="text-sm font-medium">
            {name}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t pt-2 text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="font-heading font-semibold tabular-nums">{formatIdr(amount)}</span>
      </div>
    </div>
  );
}
