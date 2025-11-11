"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GmailConnectButtonProps {
  isConnected: boolean
}

export function GmailConnectButton({ isConnected }: GmailConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[v0] Initiating Gmail connection...")
      const response = await fetch("/api/gmail/connect")
      const data = await response.json()

      if (data.error) {
        console.error("[v0] Gmail connect error:", data.error)
        setError(data.error)
        setIsLoading(false)
        return
      }

      if (data.url) {
        console.log("[v0] Redirecting to Google OAuth...")
        console.log("[v0] OAuth URL:", data.url)
        window.location.href = data.url
      }
    } catch (error) {
      console.error("[v0] Failed to connect Gmail:", error)
      setError("Failed to connect Gmail. Check console for details.")
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[v0] Starting Gmail sync...")
      const response = await fetch("/api/gmail/sync", { method: "POST" })
      const data = await response.json()

      if (data.error) {
        console.error("[v0] Gmail sync error:", data.error)
        setError(data.error)
      } else if (data.synced !== undefined) {
        alert(`Successfully synced ${data.synced} emails!`)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Failed to sync Gmail:", error)
      setError("Failed to sync Gmail. Check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {isConnected ? (
        <Button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
        >
          {isLoading ? "SYNCING..." : "SYNC_GMAIL"}
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
        >
          {isLoading ? "CONNECTING..." : "CONNECT_GMAIL"}
        </Button>
      )}

      {error && (
        <div className="space-y-2 rounded border border-red-500/30 bg-red-500/5 p-3 text-sm">
          <p className="text-red-400">{error}</p>
          <Link href="/diagnostics" className="inline-block text-xs text-yellow-500 underline hover:text-yellow-400">
            View diagnostics →
          </Link>
        </div>
      )}
    </div>
  )
}
