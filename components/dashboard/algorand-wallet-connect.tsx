'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAlgorandWallet } from '@/lib/algorand/wallet-context'
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react'

export function AlgorandWalletConnect() {
    const { accounts, activeAccount, isConnected, connectWallet, disconnectWallet } = useAlgorandWallet()
    const [copied, setCopied] = useState(false)

    const copyAddress = async () => {
        if (activeAccount) {
            await navigator.clipboard.writeText(activeAccount)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    if (isConnected && activeAccount) {
        return (
            <Card className="bg-black border-green-500/30">
                <CardHeader>
                    <CardTitle className="text-green-500 font-mono flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        WALLET CONNECTED
                    </CardTitle>
                    <CardDescription className="text-green-500/70 font-mono">
                        Algorand TestNet
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/50 border border-green-500/30 rounded font-mono">
                        <span className="text-green-500 text-sm">
                            {formatAddress(activeAccount)}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyAddress}
                            className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={disconnectWallet}
                            variant="outline"
                            className="flex-1 bg-black text-green-500 border-green-500/30 hover:bg-green-500/10 hover:text-green-400 font-mono"
                        >
                            DISCONNECT
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-black text-green-500 border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
                            asChild
                        >
                            <a
                                href={`https://testnet.algoexplorer.io/address/${activeAccount}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-black border-green-500/30">
            <CardHeader>
                <CardTitle className="text-green-500 font-mono flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    CONNECT WALLET
                </CardTitle>
                <CardDescription className="text-green-500/70 font-mono">
                    Choose your preferred Algorand wallet
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button
                    onClick={() => connectWallet('pera')}
                    className="w-full bg-black text-green-500 border border-green-500/30 hover:bg-green-500/10 hover:text-green-400 font-mono"
                    variant="outline"
                >
                    PERA WALLET
                </Button>
                <Button
                    onClick={() => connectWallet('defly')}
                    className="w-full bg-black text-green-500 border border-green-500/30 hover:bg-green-500/10 hover:text-green-400 font-mono"
                    variant="outline"
                >
                    DEFLY WALLET
                </Button>
                <p className="text-xs text-green-500/50 text-center font-mono">
                    Connecting to Algorand TestNet
                </p>
            </CardContent>
        </Card>
    )
}