import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { I18nProvider } from '../lib/i18n'
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "SpaceBook - Reserva de Espacios Deportivos y Eventos",
  description: "Reserva instalaciones deportivas y espacios para eventos fácilmente",
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
  return (
    <html lang="es">
      <body className={`${inter.className} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
