"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { PeraWalletConnect } from "@perawallet/connect"

interface BlockchainDashboardProps {
  userId: string
  userEmail: string
}

const peraWallet = new PeraWalletConnect({
  chainId: 416001, // Algorand TestNet
})

export function BlockchainDashboard({ userId, userEmail }: BlockchainDashboardProps) {
  const router = useRouter()
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<number>(0)
  const [contractAddress] = useState<string>("ALGO_CONTRACT_PLACEHOLDER")
  const [oracleStatus] = useState<"active" | "inactive">("inactive")
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (peraWallet.isConnected && accounts.length) {
          console.log("[v0] Reconnected to Pera Wallet:", accounts[0])
          setWalletAddress(accounts[0])
          setWalletConnected(true)
          fetchBalance(accounts[0])
        }
      })
      .catch((error) => {
        console.log("[v0] No existing session:", error)
      })

    // Cleanup on unmount
    return () => {
      peraWallet.connector?.off("disconnect", handleDisconnect)
    }
  }, [])

  const fetchBalance = async (address: string) => {
    try {
      const response = await fetch(`https://testnet-idx.algonode.cloud/v2/accounts/${address}`)
      const data = await response.json()
      const algoBalance = data.account.amount / 1000000 // Convert microAlgos to Algos
      console.log("[v0] Fetched balance:", algoBalance)
      setBalance(algoBalance)
    } catch (error) {
      console.error("[v0] Failed to fetch balance:", error)
      setBalance(0)
    }
  }

  const handleDisconnect = () => {
    console.log("[v0] Wallet disconnected")
    setWalletConnected(false)
    setWalletAddress("")
    setBalance(0)
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      console.log("[v0] Connecting to Pera Wallet...")

      const accounts = await peraWallet.connect()
      console.log("[v0] Connected accounts:", accounts)

      // Set up disconnect listener
      peraWallet.connector?.on("disconnect", handleDisconnect)

      setWalletAddress(accounts[0])
      setWalletConnected(true)

      // Fetch balance for connected account
      await fetchBalance(accounts[0])
    } catch (error: any) {
      console.error("[v0] Wallet connection failed:", error)
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        alert("Failed to connect wallet: " + (error?.message || "Unknown error"))
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    console.log("[v0] Disconnecting wallet...")
    peraWallet.disconnect()
    handleDisconnect()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="border-b border-[#00ff00] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-wider mb-2">
            {">"} Algorand Blockchain Integration
          </h1>
          <p className="text-sm text-[#00ff00]/70 font-mono">USER: {userEmail}</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="border border-[#00ff00]/30 bg-[#00ff00]/10 font-mono text-[#00ff00] hover:bg-[#00ff00]/20 transition-all duration-300"
        >
          ← BACK TO DASHBOARD
        </Button>
      </div>

      <Card className="bg-black border-[#00ff00] p-6 hover:border-[#00ff00]/80 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wide mb-4">{">"} Wallet Connection</h2>

        {!walletConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-[#00ff00]/70">
              Connect your Pera Wallet to interact with the Algorand blockchain
            </p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-transparent border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black disabled:opacity-50"
            >
              {isConnecting ? "CONNECTING..." : "CONNECT_PERA_WALLET"}
            </Button>
            <p className="text-xs text-[#00ff00]/50">
              Don't have Pera Wallet?{" "}
              <a
                href="https://perawallet.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#00ff00]"
              >
                Download here
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-[#00ff00]/70">WALLET_ADDRESS:</p>
                <p className="text-sm font-mono break-all">{walletAddress}</p>
              </div>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-black bg-transparent"
              >
                DISCONNECT
              </Button>
            </div>
            <div>
              <p className="text-xs text-[#00ff00]/70">BALANCE:</p>
              <p className="text-2xl">{balance.toFixed(6)} ALGO</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="bg-black border-[#00ff00] p-6 hover:border-[#00ff00]/80 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wide mb-4">{">"} Smart Contract Status</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#00ff00]/70">CONTRACT_ADDRESS:</p>
            <p className="text-sm font-mono break-all">{contractAddress}</p>
          </div>
          <div>
            <p className="text-xs text-[#00ff00]/70">CONTRACT_FUNCTIONS:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• addTask(data)</li>
              <li>• updateTaskStatus(taskID, status)</li>
              <li>• addEvent(data)</li>
              <li>• getUserBox(userAddress)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-[#00ff00]/70">PYTEAL_VERSION:</p>
            <p className="text-sm">v0.24.0</p>
          </div>
        </div>
      </Card>

      <Card className="bg-black border-[#00ff00] p-6 hover:border-[#00ff00]/80 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wide mb-4">{">"} Oracle Service Status</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#00ff00]/70">STATUS:</p>
            <span className={`text-sm ${oracleStatus === "active" ? "text-[#00ff00]" : "text-[#ff0000]"}`}>
              {oracleStatus.toUpperCase()}
            </span>
            {oracleStatus === "inactive" && <span className="text-xs text-[#ffff00]">(AWAITING_DEPLOYMENT)</span>}
          </div>
          <div>
            <p className="text-xs text-[#00ff00]/70 mb-2">ORACLE_RESPONSIBILITIES:</p>
            <ul className="text-sm space-y-1 ml-4 text-[#00ff00]/70">
              <li>• Fetch emails via Gmail API</li>
              <li>• Process with LLM (GPT API)</li>
              <li>• Submit transactions to smart contract</li>
              <li>• Manage transaction fees from oracle wallet</li>
            </ul>
          </div>
          <Button disabled className="bg-transparent border border-[#00ff00]/30 text-[#00ff00]/30">
            DEPLOY_ORACLE_SERVICE
          </Button>
        </div>
      </Card>

      <Card className="bg-black border-[#00ff00] p-6 hover:border-[#00ff00]/80 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wide mb-4">{">"} Recent Transactions</h2>
        <div className="text-sm text-[#00ff00]/70">
          <p>NO_TRANSACTIONS_FOUND</p>
          <p className="text-xs mt-2">Connect wallet and deploy oracle to begin tracking blockchain transactions</p>
        </div>
      </Card>

      <Card className="bg-black border-[#00ff00] p-6 hover:border-[#00ff00]/80 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-wide mb-4">{">"} Box Storage System</h2>
        <div className="space-y-3 text-sm">
          <p className="text-[#00ff00]/70">
            Each user has a dedicated Box in the Algorand smart contract for storing tasks and events.
          </p>
          <div>
            <p className="text-xs text-[#00ff00]/70">YOUR_BOX_KEY:</p>
            <p className="font-mono">USER_{userId.substring(0, 12)}</p>
          </div>
          <div>
            <p className="text-xs text-[#00ff00]/70">BOX_CAPACITY:</p>
            <p>0 / 32KB used</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
