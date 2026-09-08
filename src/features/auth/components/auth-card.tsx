import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  children: ReactNode;
  /** Width override — defaults to max-w-sm. Wide forms pass max-w-2xl. */
  className?: string;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerHref,
  footerLinkLabel,
  children,
  className,
}: AuthCardProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Card className={cn("w-full max-w-sm", className)}>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {children}
          <p className="text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerHref} className="underline underline-offset-4">
              {footerLinkLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
