"use client"

import { useState, useEffect, useMemo } from "react"
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

  const fetchBalance = async (addr: string) => {
    try {
      console.log("[v0] Fetching balance for address:", addr)
      console.log("[v0] Using network:", network)
      console.log("[v0] API endpoint:", networkConfig.nodeServer)

      const accountInfo = await algodClient.accountInformation(addr).do()
      console.log("[v0] Raw account info:", accountInfo)

      const algoBalance = accountInfo.amount / 1_000_000 // Convert microAlgos to Algos
      console.log("[v0] Balance calculated:", algoBalance, "ALGO")

      setBalance(algoBalance)
    } catch (error) {
      console.error("[v0] Error fetching balance:", error)
      setBalance(0)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log("[v0] Network or wallet changed, refetching balance")
      fetchBalance(walletAddress)
    }
  }, [network, walletAddress, algodClient])

  useEffect(() => {
    const restoreConnection = async () => {
      const savedWalletType = localStorage.getItem(WALLET_TYPE_KEY) as WalletType
      const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY)

      if (savedWalletType && savedAddress) {
        console.log("[v0] Restoring wallet connection:", savedWalletType, savedAddress)
        setWalletType(savedWalletType)
        setWalletAddress(savedAddress)
        await fetchBalance(savedAddress)

        // Reconnect to the wallet SDK
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
          // Clear invalid session
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
      const peraWallet = getPeraWallet()
      const accounts = await peraWallet.connect()

      peraWallet.connector?.on("disconnect", () => {
        localStorage.removeItem(WALLET_TYPE_KEY)
        localStorage.removeItem(WALLET_ADDRESS_KEY)
        setWalletAddress(null)
        setWalletType(null)
        setBalance(0)
      })

      if (accounts.length > 0) {
        console.log("[v0] Pera wallet connected:", accounts[0])
        localStorage.setItem(WALLET_TYPE_KEY, "pera")
        localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])

        setWalletAddress(accounts[0])
        setWalletType("pera")
        await fetchBalance(accounts[0])
      }
    } catch (error) {
      console.error("[v0] Error connecting to Pera:", error)
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
        await fetchBalance(accounts[0])
      }
    } catch (error) {
      console.error("[v0] Error connecting to Defly:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
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
    if (!walletAddress || !walletType) return

    setIsSending(true)
    try {
      const params = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: recipient,
        amount: amount * 1_000_000, // Convert Algos to microAlgos
        suggestedParams: params,
      })

      const txnArray = [{ txn: transaction }]
      let signedTxn

      if (walletType === "pera") {
        const peraWallet = getPeraWallet()
        signedTxn = await peraWallet.signTransaction([txnArray])
      } else {
        const deflyWallet = getDeflyWallet()
        signedTxn = await deflyWallet.signTransaction([txnArray])
      }

      const { txId } = await algodClient.sendRawTransaction(signedTxn).do()
      await algosdk.waitForConfirmation(algodClient, txId, 4)

      await refreshBalance()
      return txId
    } catch (error) {
      console.error("[v0] Error sending payment:", error)
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
