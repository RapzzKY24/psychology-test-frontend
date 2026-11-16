import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const appSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const appMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Psikotes — Platform Tes Psikologi",
    template: "%s | Psikotes",
  },
  description:
    "Platform tes psikologi: pengerjaan online, verifikasi psikolog, dan laporan resmi.",
  // The icon set lives in /public/logo-website (generated package): .ico for
  // legacy tabs, PNGs for the sized slots, and the manifest for installs.
  icons: {
    icon: [
      { url: "/logo-website/favicon.ico", sizes: "any" },
      { url: "/logo-website/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-website/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/logo-website/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/logo-website/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${appSans.variable} ${appMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
