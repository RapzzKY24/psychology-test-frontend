"use client";

import {
  Award,
  History,
  LayoutDashboard,
  ReceiptText,
  UserRound,
} from "lucide-react";
import {
  ConsoleMobileBar,
  ConsoleSidebar,
  type ConsoleConfig,
} from "@/components/layout/console-sidebar";

const CONFIG: ConsoleConfig = {
  root: "/dashboard",
  caption: "Dasbor Peserta",
  groups: [
    {
      label: "Menu",
      items: [
        { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/dashboard/riwayat", label: "Riwayat", icon: History },
        { href: "/dashboard/pembelian", label: "Pembayaran", icon: ReceiptText },
        { href: "/dashboard/sertifikat", label: "Sertifikat", icon: Award },
        { href: "/dashboard/profil", label: "Profil", icon: UserRound },
      ],
    },
  ],
};

export function ParticipantSidebar({ name, email }: { name: string; email: string }) {
  return <ConsoleSidebar config={CONFIG} name={name} email={email} />;
}

export function ParticipantMobileBar({ name }: { name: string }) {
  return <ConsoleMobileBar config={CONFIG} name={name} />;
}
