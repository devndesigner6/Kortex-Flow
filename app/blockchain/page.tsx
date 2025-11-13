"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlgorandWallet } from "@/hooks/use-algorand-wallet"
import { Wallet, Copy, RefreshCw, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BlockchainPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    address,
    balance,
    walletType,
    isConnecting,
    isSending,
    connectPera,
    connectDefly,
    disconnect,
    refreshBalance,
    sendPayment,
  } = useAlgorandWallet()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({ description: "Address copied to clipboard" })
    }
  }

  const handleSendPayment = async () => {
    if (!recipient || !amount) {
      toast({ description: "Please fill in all fields", variant: "destructive" })
      return
    }

    try {
      const txId = await sendPayment(recipient, Number.parseFloat(amount))
      toast({ description: `Transaction sent! ID: ${txId}` })
      setRecipient("")
      setAmount("")
    } catch (error) {
      toast({ description: "Failed to send transaction", variant: "destructive" })
    }
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-4 md:p-8 font-mono">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{">"} ALGORAND_BLOCKCHAIN</h1>
          <p className="text-sm text-[#00ff41]/70">Decentralized network integration</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10"
        >
          BACK_TO_DASHBOARD
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Connect Wallet Section */}
        {!address ? (
          <div className="border border-[#00ff41]/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5" />
              <h2 className="text-xl font-bold">CONNECT WALLET</h2>
            </div>
            <p className="text-sm text-[#00ff41]/70 mb-6">Choose your preferred Algorand wallet</p>

            <div className="space-y-3">
              <Button
                onClick={connectPera}
                disabled={isConnecting}
                className="w-full bg-transparent border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 h-12"
              >
                {isConnecting ? "CONNECTING..." : "PERA WALLET"}
              </Button>
              <Button
                onClick={connectDefly}
                disabled={isConnecting}
                className="w-full bg-transparent border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 h-12"
              >
                {isConnecting ? "CONNECTING..." : "DEFLY WALLET"}
              </Button>
            </div>

            <p className="text-xs text-[#00ff41]/50 mt-4 text-center">Connecting to Algorand TestNet</p>
          </div>
        ) : (
          <>
            {/* Wallet Connected */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Info */}
              <div className="border border-[#00ff41]/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5" />
                  <h2 className="text-xl font-bold">WALLET CONNECTED</h2>
                </div>
                <p className="text-sm text-[#00ff41]/70 mb-4">Algorand TestNet</p>

                <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 rounded p-3 mb-3 flex items-center justify-between">
                  <span className="text-sm">{truncateAddress(address)}</span>
                  <button onClick={copyAddress} className="hover:text-[#00ff41]/70">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={disconnect}
                  variant="outline"
                  className="w-full border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 bg-transparent"
                >
                  DISCONNECT
                </Button>
              </div>

              {/* Account Balance */}
              <div className="border border-[#00ff41]/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full border-2 border-[#00ff41] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
                  </div>
                  <h2 className="text-xl font-bold">{">"} ACCOUNT_BALANCE</h2>
                </div>
                <p className="text-sm text-[#00ff41]/70 mb-4">Current wallet balance</p>

                <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 rounded p-6 mb-3 text-center">
                  <div className="text-4xl font-bold mb-1">{balance.toFixed(6)}</div>
                  <div className="text-sm text-[#00ff41]/70">ALGO</div>
                </div>

                <Button
                  onClick={refreshBalance}
                  variant="outline"
                  className="w-full border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 flex items-center justify-center gap-2 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4" />
                  REFRESH_BALANCE
                </Button>
              </div>
            </div>

            {/* Send Payment */}
            <div className="border border-[#00ff41]/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5" />
                <h2 className="text-xl font-bold">{">"} SEND_PAYMENT</h2>
              </div>
              <p className="text-sm text-[#00ff41]/70 mb-6">Transfer ALGO to another address</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">RECIPIENT_ADDRESS</label>
                  <Input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="ALGORAND_ADDRESS_HERE"
                    className="bg-transparent border-[#00ff41]/30 text-[#00ff41] placeholder:text-[#00ff41]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">AMOUNT (ALGO)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.000000"
                    className="bg-transparent border-[#00ff41]/30 text-[#00ff41] placeholder:text-[#00ff41]/30"
                  />
                </div>

                <Button
                  onClick={handleSendPayment}
                  disabled={isSending || !recipient || !amount}
                  className="w-full bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20"
                >
                  {isSending ? "SENDING..." : "SEND_TRANSACTION"}
                </Button>

                <p className="text-xs text-[#00ff41]/50 text-center">
                  * This is a demo. In production, transactions will be signed through your wallet.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Network Info */}
        <div className="border border-[#00ff41]/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">{">"} NETWORK_INFO</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-right">TESTNET</span>
            </div>
            <div className="flex justify-between">
              <span>AlgoKit:</span>
              <span className="text-right flex items-center gap-2">
                INTEGRATED <span className="text-lg">✓</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span>Supported Wallets:</span>
              <span className="text-right">Pera, Defly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
