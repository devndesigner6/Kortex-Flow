import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AlgorandWalletProvider } from "@/lib/algorand/wallet-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KortexFlow - AI Personal Assistant",
  description: "Automatically extract tasks and meetings from Gmail and Calendar",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        <AlgorandWalletProvider>
          {children}
        </AlgorandWalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
