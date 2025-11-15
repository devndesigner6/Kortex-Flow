"use client"

import { useRouter } from "next/navigation"
import { Wallet, ArrowRight } from "lucide-react"

export function ConnectWalletButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/blockchain")}
      className="group relative flex h-14 items-center gap-3 rounded-lg border-2 border-green-500/50 bg-green-500/10 px-6 font-serif text-lg italic tracking-wide text-green-500 transition-all duration-300 hover:border-green-500 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
      aria-label="Connect Wallet"
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-lg bg-green-500/20 blur-sm" />
      </div>

      <Wallet className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

      <span className="relative z-10">Connect Wallet</span>

      <ArrowRight className="relative z-10 h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
    </button>
  )
}
