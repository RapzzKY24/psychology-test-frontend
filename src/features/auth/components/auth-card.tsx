import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerHref,
  footerLinkLabel,
  children,
}: AuthCardProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
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
