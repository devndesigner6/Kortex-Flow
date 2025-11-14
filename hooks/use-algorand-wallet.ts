"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { getPeraWallet, getDeflyWallet, disconnectAllWallets } from "@/lib/algorand/wallet-client"
import algosdk from "algosdk"
import { getNetworkConfig, type AlgorandNetwork } from "@/lib/algorand/config"

type WalletType = "pera" | "defly" | null

const WALLET_TYPE_KEY = "kortexflow_wallet_type"
const WALLET_ADDRESS_KEY = "kortexflow_wallet_address"

export function useAlgorandWallet(network: AlgorandNetwork = "testnet") {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const networkConfig = useMemo(() => getNetworkConfig(network), [network])
  const algodClient = useMemo(
    () => new algosdk.Algodv2(networkConfig.nodeToken, networkConfig.nodeServer, networkConfig.nodePort),
    [networkConfig],
  )

  const fetchBalance = useCallback(
    async (addr: string) => {
      try {
        console.log("[v0 WALLET] ===== FETCHING BALANCE =====")
        console.log("[v0 WALLET] Address:", addr)
        console.log("[v0 WALLET] Network:", network)
        
        const url = `/api/algorand/balance?address=${addr}&network=${network}`
        console.log("[v0 WALLET] API URL:", url)

        const response = await fetch(url)
        console.log("[v0 WALLET] Response status:", response.status)
        
        const data = await response.json()
        console.log("[v0 WALLET] Response data:", data)

        if (!response.ok) {
          console.error("[v0 WALLET] API error response:", data)
          setBalance(0)
          return
        }

        console.log("[v0 WALLET] Setting balance to:", data.balance)
        setBalance(data.balance)
        console.log("[v0 WALLET] ===== BALANCE FETCH COMPLETE =====")
      } catch (error) {
        console.error("[v0 WALLET] Fetch error:", error)
        console.error("[v0 WALLET] Error details:", error instanceof Error ? error.message : String(error))
        setBalance(0)
      }
    },
    [network],
  )

  useEffect(() => {
    if (walletAddress) {
      console.log("[v0] Network or wallet changed, refetching balance")
      fetchBalance(walletAddress)
    }
  }, [walletAddress, network, fetchBalance])

  useEffect(() => {
    const restoreConnection = async () => {
      const savedWalletType = localStorage.getItem(WALLET_TYPE_KEY) as WalletType
      const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY)

      if (savedWalletType && savedAddress) {
        console.log("[v0] Restoring wallet connection:", savedWalletType, savedAddress)
        setWalletType(savedWalletType)
        setWalletAddress(savedAddress)

        try {
          if (savedWalletType === "pera") {
            const peraWallet = getPeraWallet()
            await peraWallet.reconnectSession()
          } else if (savedWalletType === "defly") {
            const deflyWallet = getDeflyWallet()
            await deflyWallet.reconnectSession()
          }
        } catch (error) {
          console.error("[v0] Error reconnecting wallet:", error)
          localStorage.removeItem(WALLET_TYPE_KEY)
          localStorage.removeItem(WALLET_ADDRESS_KEY)
          setWalletType(null)
          setWalletAddress(null)
        }
      }
    }

    restoreConnection()
  }, [])

  const connectPera = async () => {
    setIsConnecting(true)
    try {
      console.log("[v0 WALLET] ===== CONNECTING PERA =====")
      const peraWallet = getPeraWallet()
      const accounts = await peraWallet.connect()
      console.log("[v0 WALLET] Pera accounts received:", accounts)

      peraWallet.connector?.on("disconnect", () => {
        console.log("[v0] Pera wallet disconnected")
        localStorage.removeItem(WALLET_TYPE_KEY)
        localStorage.removeItem(WALLET_ADDRESS_KEY)
        setWalletAddress(null)
        setWalletType(null)
        setBalance(0)
      })

      if (accounts.length > 0) {
        console.log("[v0 WALLET] Setting Pera wallet address:", accounts[0])
        localStorage.setItem(WALLET_TYPE_KEY, "pera")
        localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])

        setWalletAddress(accounts[0])
        setWalletType("pera")
        console.log("[v0 WALLET] ===== PERA CONNECTION COMPLETE =====")
      }
    } catch (error) {
      console.error("[v0 WALLET] Pera connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectDefly = async () => {
    setIsConnecting(true)
    try {
      const deflyWallet = getDeflyWallet()
      const accounts = await deflyWallet.connect()

      deflyWallet.connector?.on("disconnect", () => {
        console.log("[v0] Defly wallet disconnected")
        localStorage.removeItem(WALLET_TYPE_KEY)
        localStorage.removeItem(WALLET_ADDRESS_KEY)
        setWalletAddress(null)
        setWalletType(null)
        setBalance(0)
      })

      if (accounts.length > 0) {
        console.log("[v0] Defly wallet connected:", accounts[0])
        localStorage.setItem(WALLET_TYPE_KEY, "defly")
        localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])

        setWalletAddress(accounts[0])
        setWalletType("defly")
      }
    } catch (error) {
      console.error("[v0] Error connecting to Defly:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    console.log("[v0] Disconnecting wallet")
    localStorage.removeItem(WALLET_TYPE_KEY)
    localStorage.removeItem(WALLET_ADDRESS_KEY)

    await disconnectAllWallets()
    setWalletAddress(null)
    setWalletType(null)
    setBalance(0)
  }

  const refreshBalance = async () => {
    if (walletAddress) {
      console.log("[v0] Manually refreshing balance")
      await fetchBalance(walletAddress)
    }
  }

  const sendPayment = async (recipient: string, amount: number) => {
    if (!walletAddress || !walletType) {
      console.error("[v0 WALLET] No wallet connected")
      throw new Error("No wallet connected")
    }

    setIsSending(true)
    try {
      console.log("[v0 WALLET] Starting payment transaction:", { recipient, amount, from: walletAddress })
      
      const params = await algodClient.getTransactionParams().do()
      
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: recipient,
        amount: Math.floor(amount * 1_000_000), // Convert ALGO to microAlgos
        suggestedParams: params,
      })

      console.log("[v0 WALLET] Transaction created:", {
        from: walletAddress,
        to: recipient,
        amount: Math.floor(amount * 1_000_000),
      })

      let signedTxn: Uint8Array

      if (walletType === "pera") {
        const peraWallet = getPeraWallet()
        console.log("[v0 WALLET] Signing with Pera wallet")
        const signedTxns = await peraWallet.signTransaction([{ txn: transaction }])
        signedTxn = signedTxns[0]
        console.log("[v0 WALLET] Pera signature complete")
      } else {
        const deflyWallet = getDeflyWallet()
        console.log("[v0 WALLET] Signing with Defly wallet")
        const signedTxns = await deflyWallet.signTransaction([{ txn: transaction }])
        signedTxn = signedTxns[0]
        console.log("[v0 WALLET] Defly signature complete")
      }

      console.log("[v0 WALLET] Transaction signed successfully, sending to network...")
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      console.log("[v0 WALLET] Transaction sent, ID:", txId)

      console.log("[v0 WALLET] Waiting for confirmation...")
      await algosdk.waitForConfirmation(algodClient, txId, 4)
      console.log("[v0 WALLET] Transaction confirmed!")

      await refreshBalance()
      return txId
    } catch (error) {
      console.error("[v0 WALLET] Error sending payment:", error)
      console.error("[v0 WALLET] Error details:", error instanceof Error ? error.message : String(error))
      throw error
    } finally {
      setIsSending(false)
    }
  }

  return {
    address: walletAddress,
    walletAddress,
    balance,
    walletType,
    isConnecting,
    isSending,
    connectPera,
    connectDefly,
    disconnect,
    refreshBalance,
    sendPayment,
  }
}
