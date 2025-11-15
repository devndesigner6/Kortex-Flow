"use client"

import { PeraWalletConnect } from "@perawallet/connect"
import { DeflyWalletConnect } from "@blockshake/defly-connect"

let peraWallet: PeraWalletConnect | null = null
let deflyWallet: DeflyWalletConnect | null = null

export const getPeraWallet = () => {
  if (!peraWallet) {
    peraWallet = new PeraWalletConnect()
  }
  return peraWallet
}

export const getDeflyWallet = () => {
  if (!deflyWallet) {
    deflyWallet = new DeflyWalletConnect()
  }
  return deflyWallet
}

export const disconnectAllWallets = async () => {
  if (peraWallet) {
    await peraWallet.disconnect()
  }
  if (deflyWallet) {
    await deflyWallet.disconnect()
  }
}
