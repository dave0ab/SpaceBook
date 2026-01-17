import type React from "react";
import type { Metadata } from "next";
import { I18nProvider } from "../lib/i18n";
import { Inter, Newsreader } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SpaceBook | Book Sports & Event Spaces",
  description:
    "Reserve auditoriums, gyms, and soccer fields in seconds. Simple requests, quick approvals.",
  icons: {
    icon: "/icon.svg",
    apple: "/aaple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
