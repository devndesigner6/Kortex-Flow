"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CalendarConnectButtonProps {
  isConnected: boolean
}

export function CalendarConnectButton({ isConnected }: CalendarConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/calendar/connect")
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to connect Calendar:", error)
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/calendar/sync", { method: "POST" })
      const data = await response.json()
      if (data.synced !== undefined) {
        setError(null)
        alert(`Synced ${data.synced} calendar events!`)
        router.refresh()
      } else if (data.error) {
        setError(data.error)
      }
    } catch (error) {
      console.error("Failed to sync Calendar:", error)
      setError("Failed to sync calendar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Calendar? This will remove access tokens.")) {
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/calendar/disconnect", { method: "POST" })
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        alert("Calendar disconnected successfully!")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to disconnect Calendar:", error)
      setError("Failed to disconnect Calendar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {isConnected ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSync}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20 text-xs sm:text-sm"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3V1c0-.55-.45-1-1-1s-1 .45-1 1v1H7V1c0-.55-.45-1-1-1s-1 .45-1 1v1H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H2V8h16v12zM5 10h2v2H5v-2zm0 4h2v2H5v-2zm4-4h2v2H9v-2zm0 4h2v2H9v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
            </svg>
            {isLoading ? "SYNCING..." : "SYNC_CALENDAR"}
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="border border-red-500/30 bg-red-500/10 font-mono text-red-500 hover:bg-red-500/20 text-xs sm:text-sm whitespace-nowrap px-3"
          >
            {isLoading ? "..." : "DISCONNECT"}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20 text-xs sm:text-sm"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3V1c0-.55-.45-1-1-1s-1 .45-1 1v1H7V1c0-.55-.45-1-1-1s-1 .45-1 1v1H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H2V8h16v12zM5 10h2v2H5v-2zm0 4h2v2H5v-2zm4-4h2v2H9v-2zm0 4h2v2H9v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
          {isLoading ? "CONNECTING..." : "CONNECT_CALENDAR"}
        </Button>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
