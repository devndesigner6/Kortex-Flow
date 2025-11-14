import algosdk from "algosdk"
import { PeraWalletConnect } from "@perawallet/connect"
import { DeflyWalletConnect } from "@blockshake/defly-connect"
import { getNetworkConfig, TREASURY_WALLET, type AlgorandNetwork } from "./config"

export interface PaymentParams {
  amount: number // in microAlgos
  note?: string
  walletType: "pera" | "defly"
  network: AlgorandNetwork
}

export interface PaymentResult {
  success: boolean
  txId?: string
  error?: string
}

export class AlgorandPaymentHandler {
  private algodClient: algosdk.Algodv2
  private network: AlgorandNetwork

  constructor(network: AlgorandNetwork = "testnet") {
    this.network = network
    const config = getNetworkConfig(network)
    this.algodClient = new algosdk.Algodv2(config.nodeToken, config.nodeServer, config.nodePort)
  }

  async createPaymentTransaction(senderAddress: string, amount: number, note?: string): Promise<Uint8Array> {
    const suggestedParams = await this.algodClient.getTransactionParams().do()
    const treasuryAddress = TREASURY_WALLET[this.network]

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddress,
      to: treasuryAddress,
      amount,
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams,
    })

    return txn.toByte()
  }

  async sendPayment(params: PaymentParams, senderAddress: string): Promise<PaymentResult> {
    try {
      if (!senderAddress || senderAddress.trim() === "") {
        console.error("[v0] Address must not be null or undefined")
        return {
          success: false,
          error: "Address must not be null or undefined",
        }
      }

      console.log("[v0] Starting payment transaction:", {
        amount: params.amount,
        network: this.network,
        wallet: params.walletType,
        address: senderAddress,
      })

      const txnBytes = await this.createPaymentTransaction(senderAddress, params.amount, params.note)

      let signedTxn: Uint8Array

      if (params.walletType === "pera") {
        const peraWallet = new PeraWalletConnect()
        const [signed] = await peraWallet.signTransaction([[{ txn: txnBytes, signers: [senderAddress] }]])
        signedTxn = signed
      } else {
        const deflyWallet = new DeflyWalletConnect()
        const [signed] = await deflyWallet.signTransaction([[{ txn: txnBytes, signers: [senderAddress] }]])
        signedTxn = signed
      }

      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do()

      console.log("[v0] Payment transaction sent:", txId)

      // Wait for confirmation
      await this.waitForConfirmation(txId)

      console.log("[v0] Payment confirmed:", txId)

      return {
        success: true,
        txId,
      }
    } catch (error) {
      console.error("[v0] Payment failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
      }
    }
  }

  async waitForConfirmation(txId: string, timeout = 4): Promise<void> {
    const startTime = Date.now()
    let lastRound = (await this.algodClient.status().do())["last-round"]

    while (Date.now() - startTime < timeout * 1000) {
      try {
        const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do()
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
          return
        }
      } catch (error) {
        // Transaction not found yet, continue waiting
      }

      lastRound += 1
      await this.algodClient.statusAfterBlock(lastRound).do()
    }

    throw new Error("Transaction confirmation timeout")
  }

  async getBalance(address: string): Promise<number> {
    try {
      console.log("[v0 HANDLER] Fetching balance for address:", address, "network:", this.network)
      
      const response = await fetch(`/api/algorand/balance?address=${address}&network=${this.network}`)
      
      if (!response.ok) {
        console.error("[v0 HANDLER] API returned error status:", response.status)
        const errorData = await response.json()
        console.error("[v0 HANDLER] Error details:", errorData)
        return 0
      }

      const data = await response.json()
      console.log("[v0 HANDLER] API response:", data)
      
      // API returns balance in ALGO, convert to microAlgos
      const balanceInAlgo = data.balance || 0
      const balanceInMicroAlgos = Math.floor(balanceInAlgo * 1_000_000)
      
      console.log("[v0 HANDLER] Balance in ALGO:", balanceInAlgo)
      console.log("[v0 HANDLER] Balance in microAlgos:", balanceInMicroAlgos)
      
      return balanceInMicroAlgos
    } catch (error) {
      console.error("[v0 HANDLER] Failed to fetch balance:", error)
      return 0
    }
  }
}
