import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Icon + title + body card shared by perks, deliverables, and help blocks. */
export function InfoCard({ icon: Icon, title, children, className }: InfoCardProps) {
  return (
    <div className={cn("bg-card rounded-2xl border p-5 sm:p-6", className)}>
      <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-semibold leading-snug">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
