"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlgorandWallet } from "@/hooks/use-algorand-wallet"
import { Wallet, Copy, RefreshCw, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NetworkSwitcher } from "@/components/blockchain/network-switcher"

export default function BlockchainPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    address,
    balance,
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
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet")

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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between border-b border-primary/20 pb-6">
          <div>
            <h1 className="font-serif text-3xl italic tracking-wide text-primary sm:text-4xl">Algorand Blockchain</h1>
            <p className="mt-2 font-serif text-sm text-muted-foreground">Decentralized network integration</p>
          </div>
          <div className="flex items-center gap-3">
            <NetworkSwitcher network={network} onNetworkChange={setNetwork} />
            <Button
              onClick={() => router.push("/dashboard")}
              className="border-primary/50 bg-primary/10 font-serif text-primary hover:border-primary hover:bg-primary/20"
            >
              BACK_TO_DASHBOARD
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {!address ? (
            <div className="rounded-lg border border-primary/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">CONNECT WALLET</h2>
              </div>
              <p className="mb-6 font-serif text-sm text-muted-foreground">Choose your preferred Algorand wallet</p>

              <div className="space-y-3">
                <Button
                  onClick={connectPera}
                  disabled={isConnecting}
                  className="h-12 w-full border border-primary bg-transparent font-serif text-primary hover:bg-primary/10"
                >
                  {isConnecting ? "CONNECTING..." : "PERA WALLET"}
                </Button>
                <Button
                  onClick={connectDefly}
                  disabled={isConnecting}
                  className="h-12 w-full border border-primary bg-transparent font-serif text-primary hover:bg-primary/10"
                >
                  {isConnecting ? "CONNECTING..." : "DEFLY WALLET"}
                </Button>
              </div>

              <p className="mt-4 text-center font-serif text-xs text-muted-foreground">
                Connecting to Algorand {network === "testnet" ? "TestNet" : "MainNet"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-primary/30 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-bold text-foreground">WALLET CONNECTED</h2>
                  </div>
                  <p className="mb-4 font-serif text-sm text-muted-foreground">
                    Algorand {network === "testnet" ? "TestNet" : "MainNet"}
                  </p>

                  <div className="mb-3 flex items-center justify-between rounded border border-primary/20 bg-primary/5 p-3">
                    <span className="font-mono text-sm text-foreground">{truncateAddress(address)}</span>
                    <button onClick={copyAddress} className="text-primary hover:text-primary/70">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    onClick={disconnect}
                    variant="outline"
                    className="w-full border-primary bg-transparent font-serif text-primary hover:bg-primary/10"
                  >
                    DISCONNECT
                  </Button>
                </div>

                <div className="rounded-lg border border-primary/30 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground">{">"} ACCOUNT_BALANCE</h2>
                  </div>
                  <p className="mb-4 font-serif text-sm text-muted-foreground">Current wallet balance</p>

                  <div className="mb-3 rounded border border-primary/20 bg-primary/5 p-6 text-center">
                    <div className="mb-1 font-mono text-4xl font-bold text-foreground">{balance.toFixed(6)}</div>
                    <div className="font-serif text-sm text-muted-foreground">ALGO</div>
                  </div>

                  <Button
                    onClick={refreshBalance}
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 border-primary bg-transparent font-serif text-primary hover:bg-primary/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    REFRESH_BALANCE
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-primary/30 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">{">"} SEND_PAYMENT</h2>
                </div>
                <p className="mb-6 font-serif text-sm text-muted-foreground">Transfer ALGO to another address</p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-serif text-sm font-bold text-foreground">RECIPIENT_ADDRESS</label>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="ALGORAND_ADDRESS_HERE"
                      className="border-primary/30 bg-transparent font-mono text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-serif text-sm font-bold text-foreground">AMOUNT (ALGO)</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.000000"
                      className="border-primary/30 bg-transparent font-mono text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button
                    onClick={handleSendPayment}
                    disabled={isSending || !recipient || !amount}
                    className="w-full border border-primary bg-primary/10 font-serif text-primary hover:bg-primary/20"
                  >
                    {isSending ? "SENDING..." : "SEND_TRANSACTION"}
                  </Button>

                  <p className="text-center font-serif text-xs text-muted-foreground">
                    * This is a demo. In production, transactions will be signed through your wallet.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="rounded-lg border border-primary/30 p-6">
            <h2 className="mb-4 font-serif text-xl font-bold text-foreground">{">"} NETWORK_INFO</h2>

            <div className="space-y-2 font-serif text-sm text-foreground">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-right uppercase text-primary">{network}</span>
              </div>
              <div className="flex justify-between">
                <span>AlgoKit:</span>
                <span className="flex items-center gap-2 text-right text-primary">
                  INTEGRATED <span className="text-lg">✓</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Supported Wallets:</span>
                <span className="text-right text-primary">Pera, Defly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
