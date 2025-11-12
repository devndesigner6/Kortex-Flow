"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
      const response = await fetch("/api/gmail/connect")
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to connect Gmail:", error)
      setError("Failed to connect Gmail")
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/gmail/sync", { method: "POST" })
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.synced !== undefined) {
        alert(`Successfully synced ${data.synced} emails!`)
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to sync Gmail:", error)
      setError("Failed to sync Gmail")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Gmail? This will remove access tokens.")) {
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/gmail/disconnect", { method: "POST" })
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        alert("Gmail disconnected successfully!")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to disconnect Gmail:", error)
      setError("Failed to disconnect Gmail")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {isConnected ? (
        <div className="flex gap-2">
          <Button
            onClick={handleSync}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
            </svg>
            {isLoading ? "SYNCING..." : "SYNC_GMAIL"}
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="border border-red-500/30 bg-red-500/10 font-mono text-red-500 hover:bg-red-500/20"
          >
            {isLoading ? "..." : "DISCONNECT"}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
          </svg>
          {isLoading ? "CONNECTING..." : "CONNECT_GMAIL"}
        </Button>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
