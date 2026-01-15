import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { I18nProvider } from '../components/i18n-provider'
import { defaultLocale } from '../i18n/config'
import "./globals.css"

// Import default messages for SSG
import defaultMessages from '../messages/es.json'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // For static export, use default locale during build
  // Client-side I18nProvider handles locale switching via cookies
  return (
    <html lang={defaultLocale}>
      <body className={`${inter.className} font-sans antialiased`}>
        <I18nProvider initialMessages={defaultMessages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
