import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Vida SCMX - Alcanzar • Edificar • Multiplicar",
  description: "Somos una institución comprometida con la enseñanza de la palabra de Dios. Amamos compartir la fe y así transformar el entorno.",
  keywords: ["Vida", "SC", "Alcanzar", "Edificar", "Multiplicar"],
  icons: {
    icon: [
      { url: "/images/vida2-logo.jpg", sizes: "16x16", type: "image/png" },
      { url: "/images/vida2-logo.jpg", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/images/vida2-logo.jpg", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/vida-fav.png",
  },
  openGraph: {
    title: "Vida SCMX - Alcanzar • Edificar • Multiplicar",
    description: "Somos una institución comprometida con la enseñanza de la palabra de Dios. Amamos compartir la fe y así transformar el entorno.",
    images: ["/images/vida-sc-logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
