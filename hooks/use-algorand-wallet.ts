"use client"

import { useState } from "react"
import { getPeraWallet, getDeflyWallet, disconnectAllWallets } from "@/lib/algorand/wallet-client"
import algosdk from "algosdk"
import { ALGORAND_CONFIG } from "@/lib/algorand/config"

type WalletType = "pera" | "defly" | null

export function useAlgorandWallet() {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const algodClient = new algosdk.Algodv2(
    ALGORAND_CONFIG.nodeToken,
    ALGORAND_CONFIG.nodeServer,
    ALGORAND_CONFIG.nodePort,
  )

  const connectPera = async () => {
    setIsConnecting(true)
    try {
      const peraWallet = getPeraWallet()
      const accounts = await peraWallet.connect()

      peraWallet.connector?.on("disconnect", () => {
        setAddress(null)
        setWalletType(null)
        setBalance(0)
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setWalletType("pera")
        await fetchBalance(accounts[0])
      }
    } catch (error) {
      console.error("Error connecting to Pera:", error)
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
        setAddress(null)
        setWalletType(null)
        setBalance(0)
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setWalletType("defly")
        await fetchBalance(accounts[0])
      }
    } catch (error) {
      console.error("Error connecting to Defly:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    await disconnectAllWallets()
    setAddress(null)
    setWalletType(null)
    setBalance(0)
  }

  const fetchBalance = async (addr: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(addr).do()
      setBalance(accountInfo.amount / 1_000_000) // Convert microAlgos to Algos
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const refreshBalance = async () => {
    if (address) {
      await fetchBalance(address)
    }
  }

  const sendPayment = async (recipient: string, amount: number) => {
    if (!address || !walletType) return

    setIsSending(true)
    try {
      const params = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
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
      console.error("Error sending payment:", error)
      throw error
    } finally {
      setIsSending(false)
    }
  }

  return {
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
  }
}
