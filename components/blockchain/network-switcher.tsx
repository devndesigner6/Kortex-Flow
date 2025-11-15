"use client"
import type { AlgorandNetwork } from "@/lib/algorand/config"

interface NetworkSwitcherProps {
  network: AlgorandNetwork
  onNetworkChange: (network: AlgorandNetwork) => void
}

export function NetworkSwitcher({ network, onNetworkChange }: NetworkSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-background p-1">
      <button
        onClick={() => onNetworkChange("testnet")}
        className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
          network === "testnet" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        TestNet
      </button>
      <button
        onClick={() => onNetworkChange("mainnet")}
        className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
          network === "mainnet" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        MainNet
      </button>
    </div>
  )
}
