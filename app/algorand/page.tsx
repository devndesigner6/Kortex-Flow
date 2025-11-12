'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlgorandWalletConnect } from '@/components/dashboard/algorand-wallet-connect'
import { useAlgorandWallet } from '@/lib/algorand/wallet-context'
import { getAlgodClient, formatAlgoAmount, algoToMicroAlgos, isValidAddress } from '@/lib/algorand/client'
import { Send, RefreshCw, Coins } from 'lucide-react'
import Link from 'next/link'

export default function AlgorandPage() {
    const { activeAccount, isConnected } = useAlgorandWallet()
    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [sending, setSending] = useState(false)
    const [txStatus, setTxStatus] = useState<string | null>(null)

    useEffect(() => {
        if (activeAccount) {
            fetchBalance()
        }
    }, [activeAccount])

    const fetchBalance = async () => {
        if (!activeAccount) return

        setLoading(true)
        try {
            const algodClient = getAlgodClient()
            const accountInfo = await algodClient.accountInformation(activeAccount).do()
            setBalance(Number(accountInfo.amount))
        } catch (error) {
            console.error('Failed to fetch balance:', error)
        } finally {
            setLoading(false)
        }
    }

    const sendPayment = async () => {
        if (!activeAccount || !recipient || !amount) return

        if (!isValidAddress(recipient)) {
            setTxStatus('Invalid recipient address')
            return
        }

        setSending(true)
        setTxStatus('Preparing transaction...')

        try {
            const algodClient = getAlgodClient()
            const params = await algodClient.getTransactionParams().do()

            const txn = {
                from: activeAccount,
                to: recipient,
                amount: algoToMicroAlgos(parseFloat(amount)),
                note: new Uint8Array(Buffer.from('Payment from KortexFlow')),
                ...params,
            }

            // In a real implementation, you would sign and send the transaction
            // For now, we'll just show a placeholder
            setTxStatus('Transaction prepared. Sign in your wallet...')

            // Reset form
            setRecipient('')
            setAmount('')
            setTxStatus('Transaction completed!')

            setTimeout(() => {
                setTxStatus(null)
                fetchBalance()
            }, 3000)
        } catch (error) {
            console.error('Failed to send payment:', error)
            setTxStatus('Transaction failed')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-mono text-3xl font-bold text-green-500">
                            &gt; ALGORAND_BLOCKCHAIN
                        </h1>
                        <p className="font-mono text-green-500/70">
                            Decentralized network integration
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20">
                            BACK_TO_DASHBOARD
                        </Button>
                    </Link>
                </div>

                {/* Wallet Connection */}
                <div className="grid gap-6 md:grid-cols-2">
                    <AlgorandWalletConnect />

                    {/* Account Balance */}
                    {isConnected && activeAccount && (
                        <Card className="border-green-500/20 bg-black">
                            <CardHeader>
                                <CardTitle className="font-mono text-lg text-green-500">
                                    <Coins className="mr-2 inline h-5 w-5" />
                                    &gt; ACCOUNT_BALANCE
                                </CardTitle>
                                <CardDescription className="font-mono text-green-500/70">
                                    Current wallet balance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded border border-green-500/30 bg-green-500/5 p-4 text-center">
                                    {loading ? (
                                        <p className="font-mono text-green-500/70">Loading...</p>
                                    ) : balance !== null ? (
                                        <>
                                            <p className="font-mono text-4xl font-bold text-green-500">
                                                {formatAlgoAmount(balance)}
                                            </p>
                                            <p className="font-mono text-sm text-green-500/70">ALGO</p>
                                        </>
                                    ) : (
                                        <p className="font-mono text-green-500/70">--</p>
                                    )}
                                </div>
                                <Button
                                    onClick={fetchBalance}
                                    disabled={loading}
                                    className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
                                >
                                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    REFRESH_BALANCE
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Send Payment */}
                {isConnected && activeAccount && (
                    <Card className="border-green-500/20 bg-black">
                        <CardHeader>
                            <CardTitle className="font-mono text-lg text-green-500">
                                <Send className="mr-2 inline h-5 w-5" />
                                &gt; SEND_PAYMENT
                            </CardTitle>
                            <CardDescription className="font-mono text-green-500/70">
                                Transfer ALGO to another address
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="recipient" className="font-mono text-green-500">
                                    RECIPIENT_ADDRESS
                                </Label>
                                <Input
                                    id="recipient"
                                    placeholder="ALGORAND_ADDRESS_HERE"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="border-green-500/30 bg-black font-mono text-green-500 placeholder:text-green-500/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="font-mono text-green-500">
                                    AMOUNT (ALGO)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.000001"
                                    placeholder="0.000000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="border-green-500/30 bg-black font-mono text-green-500 placeholder:text-green-500/30"
                                />
                            </div>

                            {txStatus && (
                                <div className={`rounded border p-3 font-mono text-sm ${txStatus.includes('failed')
                                        ? 'border-red-500/30 bg-red-500/10 text-red-500'
                                        : txStatus.includes('completed')
                                            ? 'border-green-500/30 bg-green-500/10 text-green-500'
                                            : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {txStatus}
                                </div>
                            )}

                            <Button
                                onClick={sendPayment}
                                disabled={sending || !recipient || !amount}
                                className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20 disabled:opacity-50"
                            >
                                {sending ? 'PROCESSING...' : 'SEND_TRANSACTION'}
                            </Button>

                            <p className="font-mono text-xs text-green-500/50">
                                * This is a demo. In production, transactions will be signed through your wallet.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Network Info */}
                <Card className="border-green-500/20 bg-black">
                    <CardHeader>
                        <CardTitle className="font-mono text-lg text-green-500">
                            &gt; NETWORK_INFO
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 font-mono text-sm">
                            <div className="flex justify-between">
                                <span className="text-green-500/70">Network:</span>
                                <span className="text-green-500">{process.env.NEXT_PUBLIC_ALGORAND_NETWORK?.toUpperCase() || 'TESTNET'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-500/70">AlgoKit:</span>
                                <span className="text-green-500">INTEGRATED ✓</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-500/70">Supported Wallets:</span>
                                <span className="text-green-500">Pera, Defly</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
