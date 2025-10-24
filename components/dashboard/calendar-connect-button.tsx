"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CalendarConnectButtonProps {
  isConnected: boolean
}

export function CalendarConnectButton({ isConnected }: CalendarConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
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
      console.error("[v0] Failed to connect Calendar:", error)
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/calendar/sync", { method: "POST" })
      const data = await response.json()
      if (data.synced !== undefined) {
        alert(`Synced ${data.synced} calendar events!`)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Failed to sync Calendar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected) {
    return (
      <Button
        onClick={handleSync}
        disabled={isLoading}
        className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
      >
        {isLoading ? "SYNCING..." : "SYNC_CALENDAR"}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
    >
      {isLoading ? "CONNECTING..." : "CONNECT_CALENDAR"}
    </Button>
  )
}
