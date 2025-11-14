"use client"

import { useState, useEffect } from "react"
import { X, Wallet, AlertCircle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
import { usePayment } from "@/hooks/use-payment"
import { getNetworkConfig } from "@/lib/algorand/config"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  amount: number // in microAlgos
  onSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, featureName, amount, onSuccess }: PaymentModalProps) {
  const { processPayment, checkBalance, isProcessing, network } = usePayment()
  const [balance, setBalance] = useState<number>(0)
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [txId, setTxId] = useState<string>("")

  const amountInAlgo = amount / 1_000_000
  const balanceInAlgo = balance / 1_000_000

  useEffect(() => {
    if (isOpen) {
      const bal = checkBalance()
      console.log("[v0 PAYMENT MODAL] Setting balance to:", bal)
      setBalance(bal)
    }
  }, [isOpen, checkBalance])

  const handlePayment = async () => {
    if (balance < amount) {
      setStatus("error")
      setErrorMessage("Insufficient balance")
      return
    }

    setStatus("processing")
    setErrorMessage("")

    const result = await processPayment(amount, `KortexFlow: ${featureName}`)

    if (result.success && result.txId) {
      setStatus("success")
      setTxId(result.txId)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } else {
      setStatus("error")
      setErrorMessage(result.error || "Payment failed")
    }
  }

  const handleClose = () => {
    setStatus("idle")
    setErrorMessage("")
    setTxId("")
    onClose()
  }

  if (!isOpen) return null

  const explorerUrl = `${getNetworkConfig(network).explorerUrl}/${txId}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-primary/30 bg-background p-6 shadow-2xl">
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-foreground">Payment Required</h2>
              <p className="text-sm text-muted-foreground">{featureName}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="font-mono text-sm uppercase text-primary">{network}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Balance</span>
              <span className="font-mono text-sm text-foreground">{balanceInAlgo.toFixed(6)} ALGO</span>
            </div>
            <div className="flex items-center justify-between border-t border-primary/20 pt-3">
              <span className="text-sm font-medium text-foreground">Amount Due</span>
              <span className="font-mono text-lg font-bold text-primary">{amountInAlgo.toFixed(6)} ALGO</span>
            </div>
          </div>

          {status === "error" && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <div className="text-sm text-red-500">{errorMessage}</div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm text-primary">Payment successful!</div>
              </div>
              {txId && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary"
                >
                  View on Explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 rounded-lg border border-primary/30 px-4 py-2.5 font-serif text-sm text-foreground transition-colors hover:bg-primary/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || status === "success" || balance < amount}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-serif text-sm text-background transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {network === "testnet"
              ? "⚠️ TestNet - Not real money. Get free ALGO from faucet."
              : "⚡ MainNet - Real transactions on Algorand blockchain."}
          </p>
        </div>
      </div>
    </div>
  )
}
