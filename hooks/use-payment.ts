"use client"

import { useState } from "react"
import type { PaymentResult } from "@/lib/algorand/payment-handler"
import { useAlgorandWallet } from "./use-algorand-wallet"
import type { AlgorandNetwork } from "@/lib/algorand/config"
import { TREASURY_WALLET } from "@/lib/algorand/config"

export function usePayment() {
  const [network, setNetwork] = useState<AlgorandNetwork>("testnet")
  const { walletAddress, walletType, balance, sendPayment: walletSendPayment } = useAlgorandWallet(network)
  const [isProcessing, setIsProcessing] = useState(false)

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
      const treasuryAddress = TREASURY_WALLET[network]
      
      console.log("[v0 PAYMENT] Sending to treasury:", treasuryAddress)
      console.log("[v0 PAYMENT] Amount in ALGO:", amount / 1_000_000)
      
      const txId = await walletSendPayment(treasuryAddress, amount / 1_000_000)
      
      console.log("[v0 PAYMENT] Payment successful, txId:", txId)
      
      return {
        success: true,
        txId,
      }
    } catch (error) {
      console.error("[v0 PAYMENT] Payment error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const getBalance = (): number => {
    console.log("[v0 PAYMENT] Getting balance from wallet hook:", balance)
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
