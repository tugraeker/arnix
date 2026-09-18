import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Arnix · Müzik Stüdyosu İş İstasyonu",
    template: "%s · Arnix Studio",
  },
  description:
    "Arnix, müzik ekibin için stüdyo yönetimi, beat deposu, sürüm kontrolü, preset yönetimi, split sheet, stüdyo takvimi ve daha fazlasını sunan özel müzik stüdyosu dashboard'ıdır.",
  keywords: [
    "müzik stüdyosu",
    "beat yönetimi",
    "daw dashboard",
    "split sheet",
    "stüdyo takvimi",
    "preset yönetimi",
    "Arnix",
    "Arnix Studio",
  ],
  authors: [{ name: "Arnix Team" }],
  openGraph: {
    title: "Arnix Studio · Müzik Stüdyosu İş İstasyonu",
    description:
      "Beat deposu, sürüm kontrolü, presetler, split sheet, stüdyo takvimi ve daha fazlası. Müzik ekibin için tüm kaosu ortadan kaldır.",
    type: "website",
    locale: "tr_TR",
    siteName: "Arnix Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arnix Studio",
    description: "Müzik ekibin için özel stüdyo yönetim dashboard'ı.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0918" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
