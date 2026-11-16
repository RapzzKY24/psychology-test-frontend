"use client";

import {
  CalendarDays,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";
import {
  ConsoleMobileBar,
  ConsoleSidebar,
  type ConsoleConfig,
} from "./console-sidebar";

const CONFIG: ConsoleConfig = {
  root: "/instansi",
  groups: [
    {
      label: "Menu",
      items: [
        { href: "/instansi", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/instansi/pegawai", label: "Pegawai", icon: Users },
        { href: "/instansi/sesi", label: "Sesi", icon: CalendarDays },
        { href: "/instansi/pembayaran", label: "Pembayaran", icon: Wallet },
        { href: "/instansi/buat-sesi", label: "Buat Sesi", icon: CalendarDays },
        { href: "/instansi/hasil", label: "Hasil", icon: FileText },
        { href: "/instansi/laporan", label: "Laporan", icon: FileCheck2 },
      ],
    },
  ],
};

export function InstansiSidebar({ name, email }: { name: string; email: string }) {
  return <ConsoleSidebar config={CONFIG} name={name} email={email} />;
}

export function InstansiMobileBar({ name }: { name: string }) {
  return <ConsoleMobileBar config={CONFIG} name={name} />;
}
