"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AIExtractButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleExtract = async () => {
    setIsLoading(true)
    try {
      // Extract tasks from emails
      const emailResponse = await fetch("/api/ai/extract-tasks", { method: "POST" })
      const emailData = await emailResponse.json()

      // Analyze calendar events
      const eventResponse = await fetch("/api/ai/analyze-events", { method: "POST" })
      const eventData = await eventResponse.json()

      const totalTasks = (emailData.extracted || 0) + (eventData.extracted || 0)

      if (totalTasks > 0) {
        alert(`AI extracted ${totalTasks} tasks!\n\n${emailData.message || ""}\n${eventData.message || ""}`)
      } else {
        alert("No new tasks found. All emails are processed and events are up to date.")
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Failed to extract tasks:", error)
      alert("Failed to extract tasks. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExtract}
      disabled={isLoading}
      className="border border-cyan-500/30 bg-cyan-500/10 font-mono text-cyan-500 hover:bg-cyan-500/20"
    >
      {isLoading ? "AI_PROCESSING..." : "🤖 AI_EXTRACT_TASKS"}
    </Button>
  )
}
