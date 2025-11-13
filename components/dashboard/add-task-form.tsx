"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Calendar, Flag } from "lucide-react"

export function AddTaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Task title is required")
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

    console.log("[v0] Creating task:", {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      priority,
    })

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
      alert(`Failed to create task: ${error.message}`)
    } else {
      console.log("[v0] Task created successfully")
      // Reset form
      setTitle("")
      setDescription("")
      setDueDate("")
      setPriority("medium")
      window.location.reload()
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="border-primary/20 bg-background/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-xl text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          <span>Add Task Manually</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-primary/30 bg-background font-serif text-sm text-foreground placeholder:font-mono placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="relative">
            <Textarea
              placeholder="Task description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] border-primary/30 bg-background font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-primary/30 bg-background pl-10 font-mono text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="relative">
              <Flag className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="border-primary/30 bg-background pl-10 font-mono text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="group w-full border border-primary/30 bg-primary/10 font-serif text-sm text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:bg-primary/20 hover:shadow-lg disabled:opacity-50"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            {isSubmitting ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
