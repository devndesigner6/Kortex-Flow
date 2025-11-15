"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Brain, Sparkles, CheckCircle2, X, Plus, Calendar, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Email {
  id: string
  subject: string | null
  sender: string | null
  body: string | null
  received_at: string | null
}

interface Event {
  id: string
  title: string | null
  description: string | null
  start_time: string | null
  location: string | null
}

interface ExtractedTask {
  id: string
  title: string
  description: string
  priority: "urgent" | "high" | "medium" | "low"
  dueDate?: string
  source: "email" | "event"
  sourceId: string
  sourceDetails: string
}

interface AITaskExtractionContentProps {
  emails: Email[]
  events: Event[]
}

export function AITaskExtractionContent({ emails, events }: AITaskExtractionContentProps) {
  const router = useRouter()
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAddingTasks, setIsAddingTasks] = useState(false)

  const extractTasks = async () => {
    setIsExtracting(true)
    try {
      const limitedEmails = emails.slice(0, 10)
      const limitedEvents = events.slice(0, 10)

      console.log("[v0] Sending", limitedEmails.length, "emails and", limitedEvents.length, "events to AI")

      const response = await fetch("/api/ai/extract-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: limitedEmails, events: limitedEvents }),
      })

      if (!response.ok) throw new Error("Failed to extract tasks")

      const data = await response.json()
      console.log("[v0] Extracted", data.tasks?.length || 0, "tasks")
      setExtractedTasks(data.tasks)
    } catch (error) {
      console.error("Error extracting tasks:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const addAllTasks = async () => {
    setIsAddingTasks(true)
    try {
      console.log("[v0] Adding all tasks:", extractedTasks.length)

      let successCount = 0
      let failCount = 0

      for (const task of extractedTasks) {
        try {
          const response = await fetch("/api/tasks/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task }),
          })

          if (response.ok) {
            successCount++
          } else {
            failCount++
            console.error("[v0] Failed to add task:", task.title)
          }
        } catch (error) {
          failCount++
          console.error("[v0] Error adding task:", task.title, error)
        }
      }

      console.log("[v0] Bulk add complete:", { successCount, failCount })

      if (successCount > 0) {
        alert(`Successfully added ${successCount} task(s)! Redirecting to Tasks page...`)
        router.push("/tasks")
      } else {
        alert("Failed to add tasks. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Error adding all tasks:", error)
      alert("Failed to add tasks. Please try again.")
    } finally {
      setIsAddingTasks(false)
    }
  }

  const addSingleTask = async (task: ExtractedTask) => {
    try {
      console.log("[v0] ========== Adding Single Task ==========")
      console.log("[v0] Task to add:", JSON.stringify(task, null, 2))

      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      })

      console.log("[v0] Response status:", response.status)

      let responseData
      try {
        responseData = await response.json()
        console.log("[v0] Response data:", JSON.stringify(responseData, null, 2))
      } catch (jsonError) {
        console.error("[v0] Failed to parse response JSON:", jsonError)
        throw new Error("Invalid server response")
      }

      if (!response.ok) {
        console.error("[v0] Server returned error:", responseData)
        const errorMessage =
          responseData.details || responseData.error || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      console.log("[v0] SUCCESS: Task added successfully")

      // Remove the task from the list
      setExtractedTasks((prev) => prev.filter((t) => t.id !== task.id))

      // Show success message
      alert(`✓ Task "${task.title}" added successfully! View it in the Tasks page.`)

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("[v0] ERROR in addSingleTask:", error)

      let errorMessage = "Failed to add task. "
      if (error instanceof Error) {
        errorMessage += error.message
      } else {
        errorMessage += "Please try again."
      }

      alert("✗ " + errorMessage)
    }
  }

  const removeTask = (taskId: string) => {
    setExtractedTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-500/30 bg-red-500/20 text-red-400"
      case "high":
        return "border-orange-500/30 bg-orange-500/20 text-orange-400"
      case "medium":
        return "border-blue-500/30 bg-blue-500/20 text-blue-400"
      default:
        return "border-primary/30 bg-primary/20 text-primary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
        >
          <ArrowLeft className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-serif text-sm uppercase tracking-wider text-primary">Return to Dashboard</span>
        </button>
      </div>

      {/* Title Section */}
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-foreground">AI Task Extraction</h1>
            <p className="font-mono text-sm text-muted-foreground">
              Automatically detect and create tasks from emails and calendar events
            </p>
          </div>
        </div>

        <Button
          onClick={extractTasks}
          disabled={isExtracting || (emails.length === 0 && events.length === 0)}
          className="w-full gap-2 bg-primary font-serif text-sm uppercase tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          {isExtracting ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Extracting Tasks...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Extract Tasks with AI
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      {extractedTasks.length === 0 && !isExtracting && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <Brain className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="font-serif text-base text-muted-foreground mb-2">No tasks extracted yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            Click the button above to analyze your {Math.min(emails.length, 10)} most recent emails and{" "}
            {Math.min(events.length, 10)} upcoming events
          </p>
        </div>
      )}

      {/* Extracted Tasks */}
      {extractedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Suggested Tasks ({extractedTasks.length})</h2>
            <Button
              onClick={addAllTasks}
              disabled={isAddingTasks}
              className="gap-2 bg-primary font-mono text-sm text-primary-foreground hover:bg-primary/90"
            >
              {isAddingTasks ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Add All Tasks
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4">
            {extractedTasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {task.source === "email" ? (
                        <Mail className="h-4 w-4 text-primary" />
                      ) : (
                        <Calendar className="h-4 w-4 text-primary" />
                      )}
                      <h3 className="font-serif text-base font-medium text-foreground">{task.title}</h3>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`font-mono text-xs uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <Badge className="border-primary/30 bg-primary/20 font-mono text-xs text-primary">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">From: {task.sourceDetails}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addSingleTask(task)}
                      size="sm"
                      className="gap-1 bg-primary/20 font-mono text-xs text-primary hover:bg-primary/30"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                    <Button
                      onClick={() => removeTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
