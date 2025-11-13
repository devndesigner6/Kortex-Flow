"use client"

import { useState } from "react"
import { AlgorandPaymentHandler, type PaymentResult } from "@/lib/algorand/payment-handler"
import { useAlgorandWallet } from "./use-algorand-wallet"
import type { AlgorandNetwork } from "@/lib/algorand/config"

export function usePayment() {
  const { walletAddress, walletType } = useAlgorandWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [network, setNetwork] = useState<AlgorandNetwork>("testnet")

  const processPayment = async (amount: number, note?: string): Promise<PaymentResult> => {
    if (!walletAddress || !walletType) {
      return {
        success: false,
        error: "Wallet not connected",
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

  const checkBalance = async (): Promise<number> => {
    if (!walletAddress) return 0

    const handler = new AlgorandPaymentHandler(network)
    return handler.getBalance(walletAddress)
  }

  return {
    processPayment,
    checkBalance,
    isProcessing,
    network,
    setNetwork,
    isWalletConnected: !!walletAddress,
  }
}
