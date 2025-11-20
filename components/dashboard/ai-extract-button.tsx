"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain } from "lucide-react"

export function AIExtractButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleExtract = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Starting AI extraction...")

      // Extract tasks from emails
      const emailResponse = await fetch("/api/ai/extract-tasks", { method: "POST" })
      const emailData = await emailResponse.json()
      console.log("[v0] Email extraction result:", emailData)

      // Analyze calendar events
      const eventResponse = await fetch("/api/ai/analyze-events", { method: "POST" })
      const eventData = await eventResponse.json()
      console.log("[v0] Event analysis result:", eventData)

      const totalTasks = (emailData.extracted || 0) + (eventData.extracted || 0)

      if (totalTasks > 0) {
        const summary = [
          `✅ Extracted ${totalTasks} actionable tasks`,
          emailData.extracted > 0 ? `📧 ${emailData.extracted} from emails` : null,
          eventData.extracted > 0 ? `📅 ${eventData.extracted} from calendar events` : null,
        ]
          .filter(Boolean)
          .join("\n")

        alert(summary)
      } else {
        alert("✨ All caught up! No new actionable tasks found in your emails or calendar events.")
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Failed to extract tasks:", error)
      alert("❌ Failed to extract tasks. Please check your Gmail and Calendar connections.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExtract}
      disabled={isLoading}
      className="border border-cyan-500/30 bg-cyan-500/10 font-mono text-cyan-500 hover:bg-cyan-500/20 disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Brain className="mr-2 h-4 w-4 animate-pulse" />
          AI_PROCESSING...
        </>
      ) : (
        <>
          <Brain className="mr-2 h-4 w-4" />
          AI_EXTRACT_TASKS
        </>
      )}
    </Button>
  )
}
