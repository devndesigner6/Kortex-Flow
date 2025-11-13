"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Keyboard, Save, Calendar, PenLine } from "lucide-react"

type Priority = "low" | "medium" | "high"

export function AddTaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Task briefing is required")
      return
    }

    setIsSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to add tasks")
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      priority: priority,
      status: "pending",
      source: "manual",
    })

    if (error) {
      console.error("[v0] Error creating task:", error)
      alert(`Failed to inject task: ${error.message}`)
    } else {
      setTitle("")
      setDescription("")
      setDueDate("")
      setPriority("medium")
      setIsExpanded(false)
      window.location.reload()
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="border-primary/10 bg-background/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle
          className="flex cursor-pointer items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <Save className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
          <span>+ Manual Task Injection</span>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Input
                placeholder="TASK BRIEFING (REQUIRED)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-primary/30 bg-background font-mono text-sm uppercase text-foreground placeholder:font-mono placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-3 z-10">
                <PenLine className="h-4 w-4 text-muted-foreground" />
              </div>
              <Textarea
                placeholder="OPERATOR NOTES (OPTIONAL)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-primary/30 bg-background pl-10 font-mono text-sm text-foreground placeholder:font-mono placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="DEADLINE PROTOCOL"
                  className="border-primary/30 bg-background pl-10 font-mono text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-1 rounded-md border border-primary/30 bg-background p-1">
                {(["low", "medium", "high"] as Priority[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`flex-1 rounded px-2 py-2 font-mono text-xs uppercase transition-all ${
                      priority === level
                        ? level === "low"
                          ? "bg-yellow-500/20 text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                          : level === "medium"
                            ? "bg-primary/20 text-primary shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : "bg-red-500/20 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        : "text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden border border-primary/20 bg-primary/5 font-mono text-xs uppercase tracking-wider text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Save className="h-3.5 w-3.5" />
                {isSubmitting ? "Injecting..." : "+ Inject Task"}
              </span>
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
