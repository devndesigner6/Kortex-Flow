import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono, Instrument_Serif, Playfair_Display } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { SplashScreen } from "@/components/splash-screen"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
const playfairDisplay = Playfair_Display({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "KortexFlow - AI Personal Assistant",
  description: "Automatically extract tasks and meetings from Gmail and Calendar",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSerif.variable} ${geistMono.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-mono antialiased">
        <SplashScreen />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
