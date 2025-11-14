"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAlgorandWallet } from "@/hooks/use-algorand-wallet"
import { Wallet, Copy, RefreshCw, Send } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { NetworkSwitcher } from "@/components/blockchain/network-switcher"

export default function BlockchainPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet")
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

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
  } = useAlgorandWallet(network)

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

  const handleRefreshBalance = async () => {
    setDebugInfo("Starting balance refresh...")
    try {
      await refreshBalance()
      setDebugInfo(`Balance updated: ${balance} ALGO at ${new Date().toLocaleTimeString()}`)
    } catch (error) {
      setDebugInfo(`Error: ${error instanceof Error ? error.message : "Failed to fetch balance"}`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-primary/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl italic tracking-wide text-primary sm:text-5xl lg:text-6xl">
              Algorand Blockchain
            </h1>
            <p className="mt-2 font-serif text-base text-muted-foreground sm:text-lg">
              Decentralized network integration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NetworkSwitcher network={network} onNetworkChange={setNetwork} />
            <Button
              onClick={() => router.push("/dashboard")}
              className="border-primary/50 bg-primary/10 font-serif text-base text-primary hover:border-primary hover:bg-primary/20 sm:text-lg"
            >
              BACK_TO_DASHBOARD
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {!address ? (
            <div className="rounded-lg border border-primary/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">CONNECT WALLET</h2>
              </div>
              <p className="mb-6 font-serif text-base text-muted-foreground sm:text-lg">
                Choose your preferred Algorand wallet
              </p>

              <div className="space-y-3">
                <Button
                  onClick={connectPera}
                  disabled={isConnecting}
                  className="h-14 w-full border border-primary bg-transparent font-serif text-lg text-primary hover:bg-primary/10 sm:text-xl"
                >
                  {isConnecting ? "CONNECTING..." : "PERA WALLET"}
                </Button>
                <Button
                  onClick={connectDefly}
                  disabled={isConnecting}
                  className="h-14 w-full border border-primary bg-transparent font-serif text-lg text-primary hover:bg-primary/10 sm:text-xl"
                >
                  {isConnecting ? "CONNECTING..." : "DEFLY WALLET"}
                </Button>
              </div>

              <p className="mt-4 text-center font-serif text-sm text-muted-foreground sm:text-base">
                Connecting to Algorand {network === "testnet" ? "TestNet" : "MainNet"}
              </p>
            </div>
          ) : (
            <>
              {debugInfo && (
                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                  <p className="font-mono text-sm text-yellow-500">{debugInfo}</p>
                </div>
              )}

              <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                <p className="font-mono text-sm text-blue-500">
                  Connected Address: {address}
                </p>
                <p className="font-mono text-sm text-blue-500">
                  Network: {network.toUpperCase()}
                </p>
                <p className="font-mono text-sm text-blue-500">
                  Balance API: /api/algorand/balance?address={address.slice(0, 8)}...&network={network}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-primary/30 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                    <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">WALLET CONNECTED</h2>
                  </div>
                  <p className="mb-4 font-serif text-base text-muted-foreground sm:text-lg">
                    Algorand {network === "testnet" ? "TestNet" : "MainNet"}
                  </p>

                  <div className="mb-3 flex items-center justify-between rounded border border-primary/20 bg-primary/5 p-4">
                    <span className="font-mono text-base text-foreground sm:text-lg">{truncateAddress(address)}</span>
                    <button onClick={copyAddress} className="text-primary hover:text-primary/70">
                      <Copy className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  <Button
                    onClick={disconnect}
                    variant="outline"
                    className="h-12 w-full border-primary bg-transparent font-serif text-lg text-primary hover:bg-primary/10 sm:text-xl"
                  >
                    DISCONNECT
                  </Button>
                </div>

                <div className="rounded-lg border border-primary/30 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary sm:h-7 sm:w-7">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{">"} ACCOUNT_BALANCE</h2>
                  </div>
                  <p className="mb-4 font-serif text-base text-muted-foreground sm:text-lg">Current wallet balance</p>

                  <div className="mb-3 rounded border border-primary/20 bg-primary/5 p-6 text-center">
                    <div className="mb-2 font-mono text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl">
                      {balance.toFixed(6)}
                    </div>
                    <div className="font-serif text-lg text-muted-foreground sm:text-xl">ALGO</div>
                    <div className="mt-2 font-mono text-xs text-muted-foreground">
                      Click refresh to update
                    </div>
                  </div>

                  <Button
                    onClick={handleRefreshBalance}
                    variant="outline"
                    className="flex h-12 w-full items-center justify-center gap-2 border-primary bg-transparent font-serif text-lg text-primary hover:bg-primary/10 sm:text-xl"
                  >
                    <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6" />
                    REFRESH_BALANCE
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-primary/30 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Send className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                  <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{">"} SEND_PAYMENT</h2>
                </div>
                <p className="mb-6 font-serif text-base text-muted-foreground sm:text-lg">
                  Transfer ALGO to another address
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-serif text-base font-bold text-foreground sm:text-lg">
                      RECIPIENT_ADDRESS
                    </label>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="ALGORAND_ADDRESS_HERE"
                      className="h-12 border-primary/30 bg-transparent font-mono text-base text-foreground placeholder:text-muted-foreground sm:text-lg"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-serif text-base font-bold text-foreground sm:text-lg">
                      AMOUNT (ALGO)
                    </label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.000000"
                      className="h-12 border-primary/30 bg-transparent font-mono text-base text-foreground placeholder:text-muted-foreground sm:text-lg"
                    />
                  </div>

                  <Button
                    onClick={handleSendPayment}
                    disabled={isSending || !recipient || !amount}
                    className="h-14 w-full border border-primary bg-primary/10 font-serif text-lg text-primary hover:bg-primary/20 sm:text-xl"
                  >
                    {isSending ? "SENDING..." : "SEND_TRANSACTION"}
                  </Button>

                  <p className="text-center font-serif text-sm text-muted-foreground sm:text-base">
                    * Transactions are signed securely through your wallet.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="rounded-lg border border-primary/30 p-6">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground sm:text-3xl">{">"} NETWORK_INFO</h2>

            <div className="space-y-3 font-serif text-base text-foreground sm:text-lg">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-right uppercase text-primary">{network}</span>
              </div>
              <div className="flex justify-between">
                <span>AlgoKit:</span>
                <span className="flex items-center gap-2 text-right text-primary">
                  INTEGRATED <span className="text-xl">✓</span>
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
