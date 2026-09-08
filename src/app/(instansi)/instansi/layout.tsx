import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireServerRole } from "@/lib/api/server";

export const metadata: Metadata = { title: { default: "Instansi", template: "%s | Dasbor Instansi" } };

export default async function InstansiLayout({ children }: LayoutProps<"/instansi">) {
  // Real role check — proxy.ts is only a cheap cookie gate.
  const session = await requireServerRole("INSTANSI");
  if (!session) notFound();

  return <div className="mx-auto w-full max-w-5xl p-4 md:p-6">{children}</div>;
}
