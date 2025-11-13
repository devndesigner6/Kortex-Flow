"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export function ConnectWalletButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/blockchain")}
      className="bg-transparent border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 px-8 py-6 text-lg font-bold rounded-lg flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
    >
      CONNECT WALLET
      <ArrowRight className="w-5 h-5" />
    </Button>
  )
}
