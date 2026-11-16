"use client";

import {
  Building2,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  LayoutDashboard,
  Newspaper,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";
import {
  ConsoleMobileBar,
  ConsoleSidebar,
  type ConsoleConfig,
} from "./console-sidebar";

const CONFIG: ConsoleConfig = {
  root: "/admin",
  caption: "Konsol Admin",
  groups: [
    {
      label: "Menu",
      items: [
        { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/admin/users", label: "Pengguna", icon: Users },
        { href: "/admin/tes", label: "Tes", icon: ClipboardList },
        { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
        { href: "/admin/institusi", label: "Institusi", icon: Building2 },
      ],
    },
    {
      label: "Operasional",
      items: [
        { href: "/admin/sesi", label: "Sesi", icon: CalendarDays },
        { href: "/admin/pembayaran", label: "Pembayaran", icon: Wallet },
        { href: "/admin/invoice", label: "Invoice", icon: ReceiptText },
        { href: "/admin/hasil", label: "Hasil", icon: ChartColumn },
      ],
    },
  ],
};

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  return <ConsoleSidebar config={CONFIG} name={name} email={email} />;
}

export function AdminMobileBar({ name }: { name: string }) {
  return <ConsoleMobileBar config={CONFIG} name={name} />;
}
