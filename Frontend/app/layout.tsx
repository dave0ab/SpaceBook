import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { defaultLocale } from './i18n/config'
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "SpaceBook - Reserva de Espacios Deportivos y Eventos",
  description: "Reserva instalaciones deportivas y espacios para eventos fácilmente",
  generator: "v0.app",
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // For static export, use default locale during build
  // Locale switching will be handled client-side via cookies
  let locale: string = defaultLocale;
  let messages: any;
  
  try {
    locale = await getLocale();
    messages = await getMessages();
  } catch (error) {
    // Fallback for static export - use default locale
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
