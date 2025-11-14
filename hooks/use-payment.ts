"use client"

import { useState } from "react"
import { AlgorandPaymentHandler, type PaymentResult } from "@/lib/algorand/payment-handler"
import { useAlgorandWallet } from "./use-algorand-wallet"
import type { AlgorandNetwork } from "@/lib/algorand/config"

export function usePayment() {
  const { walletAddress, walletType, balance } = useAlgorandWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [network, setNetwork] = useState<AlgorandNetwork>("testnet")

  const processPayment = async (amount: number, note?: string): Promise<PaymentResult> => {
    console.log("[v0 PAYMENT] Processing payment with:", { walletAddress, walletType, amount })
    
    if (!walletAddress || !walletType) {
      console.error("[v0 PAYMENT] Wallet not connected:", { walletAddress, walletType })
      return {
        success: false,
        error: "Wallet not connected",
      }
    }

    if (walletAddress.trim() === "") {
      console.error("[v0 PAYMENT] Wallet address is empty")
      return {
        success: false,
        error: "Address must not be null or undefined",
      }
    }

    setIsProcessing(true)

    try {
      const handler = new AlgorandPaymentHandler(network)
      const result = await handler.sendPayment(
        {
          amount,
          note,
          walletType,
          network,
        },
        walletAddress,
      )

      return result
    } finally {
      setIsProcessing(false)
    }
  }

  const getBalance = (): number => {
    console.log("[v0 PAYMENT] Getting balance from wallet hook:", balance)
    // Convert from ALGO to microAlgos for compatibility
    return balance * 1_000_000
  }

  return {
    processPayment,
    checkBalance: getBalance,
    isProcessing,
    network,
    setNetwork,
    isWalletConnected: !!walletAddress,
  }
}
