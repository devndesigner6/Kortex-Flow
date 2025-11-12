'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAlgorandWallet } from '@/lib/algorand/wallet-context'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'

export function AlgorandWalletConnect() {
    const { accounts, activeAccount, isConnected, provider, connectWallet, disconnectWallet } = useAlgorandWallet()
    const [copied, setCopied] = useState(false)
    const [connecting, setConnecting] = useState(false)

    const handleConnect = async (walletProvider: 'pera' | 'defly') => {
        setConnecting(true)
        try {
            await connectWallet(walletProvider)
        } catch (error) {
            console.error('Connection failed:', error)
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        try {
            await disconnectWallet()
        } catch (error) {
            console.error('Disconnect failed:', error)
        }
    }

    const copyAddress = () => {
        if (activeAccount) {
            navigator.clipboard.writeText(activeAccount)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    if (isConnected && activeAccount) {
        return (
            <Card className="border-green-500/20 bg-black">
                <CardHeader>
                    <CardTitle className="font-mono text-lg text-green-500">
                        &gt; ALGORAND_WALLET_CONNECTED
                    </CardTitle>
                    <CardDescription className="font-mono text-green-500/70">
                        Provider: {provider?.toUpperCase()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded border border-green-500/30 bg-green-500/5 p-3">
                        <code className="font-mono text-sm text-green-500">
                            {formatAddress(activeAccount)}
                        </code>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyAddress}
                            className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    {accounts.length > 1 && (
                        <div className="space-y-2">
                            <p className="font-mono text-xs text-green-500/70">
                                CONNECTED_ACCOUNTS: {accounts.length}
                            </p>
                            <div className="max-h-32 space-y-1 overflow-y-auto">
                                {accounts.map((account, index) => (
                                    <div
                                        key={account}
                                        className="rounded border border-green-500/20 bg-green-500/5 p-2 font-mono text-xs text-green-500/70"
                                    >
                                        {index + 1}. {formatAddress(account)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handleDisconnect}
                        className="w-full border border-red-500/30 bg-red-500/10 font-mono text-red-500 hover:bg-red-500/20"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        DISCONNECT_WALLET
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-green-500/20 bg-black">
            <CardHeader>
                <CardTitle className="font-mono text-lg text-green-500">
                    <Wallet className="mr-2 inline h-5 w-5" />
                    &gt; CONNECT_ALGORAND_WALLET
                </CardTitle>
                <CardDescription className="font-mono text-green-500/70">
                    Choose a wallet provider to connect
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button
                    onClick={() => handleConnect('pera')}
                    disabled={connecting}
                    className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
                >
                    {connecting ? 'CONNECTING...' : 'CONNECT_PERA_WALLET'}
                </Button>

                <Button
                    onClick={() => handleConnect('defly')}
                    disabled={connecting}
                    className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
                >
                    {connecting ? 'CONNECTING...' : 'CONNECT_DEFLY_WALLET'}
                </Button>

                <p className="font-mono text-xs text-green-500/50">
                    * Wallet connection allows you to interact with the Algorand blockchain
                </p>
            </CardContent>
        </Card>
    )
}
