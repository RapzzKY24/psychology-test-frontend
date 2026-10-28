import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import type { CheckoutView } from "../checkout-result-view";

export function CheckoutStatusIcon({ view }: { view: CheckoutView }) {
  if (view === "paid") return <CheckCircle2 className="size-10 text-emerald-600" aria-hidden />;
  if (view === "verifying")
    return <Loader2 className="text-primary size-10 animate-spin" aria-hidden />;
  if (view === "waiting") return <Clock className="size-10 text-amber-500" aria-hidden />;
  return <XCircle className="text-destructive size-10" aria-hidden />;
}
