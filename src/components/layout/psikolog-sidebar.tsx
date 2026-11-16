"use client";

import {
  Award,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import {
  ConsoleMobileBar,
  ConsoleSidebar,
  type ConsoleConfig,
} from "./console-sidebar";

const CONFIG: ConsoleConfig = {
  root: "/psikolog",
  caption: "Dasbor Psikolog",
  groups: [
    {
      label: "Menu",
      items: [
        { href: "/psikolog", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/psikolog/review", label: "Review Hasil", icon: ClipboardCheck },
        { href: "/psikolog/laporan", label: "Laporan", icon: FileText },
        { href: "/psikolog/sertifikat", label: "Sertifikat", icon: Award },
        { href: "/psikolog/profil", label: "Profil & TTD", icon: UserRound },
      ],
    },
  ],
};

export function PsikologSidebar({ name, email }: { name: string; email: string }) {
  return <ConsoleSidebar config={CONFIG} name={name} email={email} />;
}

export function PsikologMobileBar({ name }: { name: string }) {
  return <ConsoleMobileBar config={CONFIG} name={name} />;
}
