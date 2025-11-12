'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { PeraWalletConnect } from '@perawallet/connect'
import { DeflyWalletConnect } from '@blockshake/defly-connect'

type WalletProvider = 'pera' | 'defly' | null

interface AlgorandWalletContextType {
    accounts: string[]
    activeAccount: string | null
    isConnected: boolean
    provider: WalletProvider
    connectWallet: (provider: WalletProvider) => Promise<void>
    disconnectWallet: () => Promise<void>
    signTransaction: (txn: any) => Promise<Uint8Array>
}

const AlgorandWalletContext = createContext<AlgorandWalletContextType | undefined>(undefined)

let peraWallet: PeraWalletConnect | null = null
let deflyWallet: DeflyWalletConnect | null = null

export function AlgorandWalletProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<string[]>([])
    const [activeAccount, setActiveAccount] = useState<string | null>(null)
    const [provider, setProvider] = useState<WalletProvider>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Initialize wallet connections
        if (typeof window !== 'undefined') {
            peraWallet = new PeraWalletConnect()
            deflyWallet = new DeflyWalletConnect()

            // Reconnect to Pera Wallet if previously connected
            peraWallet.reconnectSession().then((accounts) => {
                if (accounts && accounts.length > 0) {
                    setAccounts(accounts)
                    setActiveAccount(accounts[0])
                    setProvider('pera')
                    setIsConnected(true)
                }
            }).catch(console.error)
        }

        return () => {
            // Cleanup
        }
    }, [])

    const connectWallet = async (walletProvider: WalletProvider) => {
        try {
            let connectedAccounts: string[] = []

            if (walletProvider === 'pera' && peraWallet) {
                connectedAccounts = await peraWallet.connect()
                setProvider('pera')
            } else if (walletProvider === 'defly' && deflyWallet) {
                connectedAccounts = await deflyWallet.connect()
                setProvider('defly')
            }

            if (connectedAccounts.length > 0) {
                setAccounts(connectedAccounts)
                setActiveAccount(connectedAccounts[0])
                setIsConnected(true)

                // Store in localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('algorand_wallet_provider', walletProvider || '')
                    localStorage.setItem('algorand_active_account', connectedAccounts[0])
                }
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error)
            throw error
        }
    }

    const disconnectWallet = async () => {
        try {
            if (provider === 'pera' && peraWallet) {
                await peraWallet.disconnect()
            } else if (provider === 'defly' && deflyWallet) {
                await deflyWallet.disconnect()
            }

            setAccounts([])
            setActiveAccount(null)
            setProvider(null)
            setIsConnected(false)

            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('algorand_wallet_provider')
                localStorage.removeItem('algorand_active_account')
            }
        } catch (error) {
            console.error('Failed to disconnect wallet:', error)
            throw error
        }
    }

    const signTransaction = async (txn: any): Promise<Uint8Array> => {
        if (!provider || !activeAccount) {
            throw new Error('No wallet connected')
        }

        try {
            let signedTxn: Uint8Array

            if (provider === 'pera' && peraWallet) {
                const signedTxns = await peraWallet.signTransaction([[{ txn }]])
                signedTxn = signedTxns[0]
            } else if (provider === 'defly' && deflyWallet) {
                const signedTxns = await deflyWallet.signTransaction([[{ txn }]])
                signedTxn = signedTxns[0]
            } else {
                throw new Error('Unsupported wallet provider')
            }

            return signedTxn
        } catch (error) {
            console.error('Failed to sign transaction:', error)
            throw error
        }
    }

    return (
        <AlgorandWalletContext.Provider
            value={{
                accounts,
                activeAccount,
                isConnected,
                provider,
                connectWallet,
                disconnectWallet,
                signTransaction,
            }}
        >
            {children}
        </AlgorandWalletContext.Provider>
    )
}

export const useAlgorandWallet = () => {
    const context = useContext(AlgorandWalletContext)
    if (context === undefined) {
        throw new Error('useAlgorandWallet must be used within an AlgorandWalletProvider')
    }
    return context
}
