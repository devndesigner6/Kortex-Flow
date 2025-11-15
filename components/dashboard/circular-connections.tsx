"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, RefreshCw } from "lucide-react"

interface CircularConnectionsProps {
  isGmailConnected: boolean
  isCalendarConnected: boolean
}

export function CircularConnections({ isGmailConnected, isCalendarConnected }: CircularConnectionsProps) {
  const [gmailLoading, setGmailLoading] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [lastGmailSync, setLastGmailSync] = useState<Date | null>(null)
  const [lastCalendarSync, setLastCalendarSync] = useState<Date | null>(null)
  const router = useRouter()

  const handleGmailConnect = async () => {
    setGmailLoading(true)
    try {
      const response = await fetch("/api/gmail/connect")
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to connect Gmail:", error)
      setGmailLoading(false)
    }
  }

  const handleGmailSync = async () => {
    setGmailLoading(true)
    try {
      const response = await fetch("/api/gmail/sync", { method: "POST" })
      const data = await response.json()
      if (data.error) {
        alert(`Sync failed: ${data.error}. Please reconnect Gmail.`)
      } else if (data.synced !== undefined) {
        alert(`Successfully synced ${data.synced} emails!`)
        setLastGmailSync(new Date())
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to sync Gmail:", error)
      alert("Failed to sync Gmail. Please try again or reconnect.")
    } finally {
      setGmailLoading(false)
    }
  }

  const handleGmailDisconnect = async () => {
    if (!confirm("Disconnect Gmail?")) return
    setGmailLoading(true)
    try {
      const response = await fetch("/api/gmail/disconnect", { method: "POST" })
      const data = await response.json()
      if (!data.error) {
        alert("Gmail disconnected!")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to disconnect Gmail:", error)
    } finally {
      setGmailLoading(false)
    }
  }

  const handleCalendarConnect = async () => {
    setCalendarLoading(true)
    try {
      const response = await fetch("/api/calendar/connect")
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to connect Calendar:", error)
      setCalendarLoading(false)
    }
  }

  const handleCalendarSync = async () => {
    setCalendarLoading(true)
    try {
      const response = await fetch("/api/calendar/sync", { method: "POST" })
      const data = await response.json()
      if (data.error) {
        alert(`Sync failed: ${data.error}. Please reconnect Calendar.`)
      } else if (data.synced !== undefined) {
        alert(`Synced ${data.synced} calendar events!`)
        setLastCalendarSync(new Date())
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to sync Calendar:", error)
      alert("Failed to sync Calendar. Please try again or reconnect.")
    } finally {
      setCalendarLoading(false)
    }
  }

  const handleCalendarDisconnect = async () => {
    if (!confirm("Disconnect Calendar?")) return
    setCalendarLoading(true)
    try {
      const response = await fetch("/api/calendar/disconnect", { method: "POST" })
      const data = await response.json()
      if (!data.error) {
        alert("Calendar disconnected!")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to disconnect Calendar:", error)
    } finally {
      setCalendarLoading(false)
    }
  }

  const formatSyncTime = (date: Date | null) => {
    if (!date) return null
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Gmail Connection */}
        <div className="group relative flex flex-col items-center gap-2 sm:gap-3">
          <button
            onClick={isGmailConnected ? handleGmailSync : handleGmailConnect}
            disabled={gmailLoading}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg transition-all duration-500 hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-24 sm:w-24 md:h-28 md:w-28"
          >
            {/* Animated glow orb */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {isGmailConnected ? (
              <RefreshCw
                className={`relative z-10 h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 md:h-14 md:w-14 ${gmailLoading ? "animate-spin" : ""}`}
              />
            ) : (
              <svg
                className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  className="text-primary transition-transform duration-300 group-hover:scale-110"
                  d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                />
              </svg>
            )}

            {/* Spinning border on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-primary/60" />
            </div>
          </button>

          <span className="text-center font-serif text-xs text-primary sm:text-sm md:text-base">
            {gmailLoading ? "Loading..." : isGmailConnected ? "INITIATE GMAIL FEED" : "Connect"}
          </span>

          {/* Disconnect button (shown when connected) */}
          {isGmailConnected && (
            <button
              onClick={handleGmailDisconnect}
              disabled={gmailLoading}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-500 transition-all duration-300 hover:scale-110 hover:bg-red-500/30"
              title="Disconnect Gmail"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Calendar Connection */}
        <div className="group relative flex flex-col items-center gap-2 sm:gap-3">
          <button
            onClick={isCalendarConnected ? handleCalendarSync : handleCalendarConnect}
            disabled={calendarLoading}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg transition-all duration-500 hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-24 sm:w-24 md:h-28 md:w-28"
          >
            {/* Animated glow orb */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {isCalendarConnected ? (
              <RefreshCw
                className={`relative z-10 h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 md:h-14 md:w-14 ${calendarLoading ? "animate-spin" : ""}`}
              />
            ) : (
              <svg
                className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  className="text-primary transition-transform duration-300 group-hover:scale-110"
                  d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
            )}

            {/* Spinning border on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-primary/60" />
            </div>
          </button>

          <span className="text-center font-serif text-xs text-primary sm:text-sm md:text-base">
            {calendarLoading ? "Loading..." : isCalendarConnected ? "INITIATE CALENDAR FEED" : "Connect"}
          </span>

          {/* Disconnect button (shown when connected) */}
          {isCalendarConnected && (
            <button
              onClick={handleCalendarDisconnect}
              disabled={calendarLoading}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-500 transition-all duration-300 hover:scale-110 hover:bg-red-500/30"
              title="Disconnect Calendar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {(lastGmailSync || lastCalendarSync) && (
        <div className="mt-3 flex flex-col gap-1 text-center font-mono text-xs text-muted-foreground sm:mt-4 sm:flex-row sm:justify-center sm:gap-4">
          {lastGmailSync && <span>LAST GMAIL SYNC: {formatSyncTime(lastGmailSync)}</span>}
          {lastCalendarSync && <span>LAST CALENDAR SYNC: {formatSyncTime(lastCalendarSync)}</span>}
        </div>
      )}
    </div>
  )
}
