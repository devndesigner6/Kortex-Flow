"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  priority: string | null
  status: string
  source: string | null
}

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const router = useRouter()
  const supabase = createClient()

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      default:
        return "bg-green-500/20 text-green-500 border-green-500/30"
    }
  }

  const getSourceIcon = (source: string | null) => {
    switch (source) {
      case "email":
        return "📧"
      case "calendar":
        return "📅"
      default:
        return "✏️"
    }
  }

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed"

    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

      if (!error) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
        router.refresh()
      }
    } catch (error) {
      console.log('Task update error (Supabase may not be configured):', error)
      // Update locally for demo purposes
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    }
  }

  return (
    <Card className="border-green-500/20 bg-black">
      <CardHeader>
        <CardTitle className="font-mono text-xl text-green-500">&gt; TASK_QUEUE</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="font-mono text-sm text-green-500/50">NO_TASKS_FOUND. System idle.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-lg border border-green-500/20 bg-green-500/5 p-4 ${task.status === "completed" ? "opacity-50" : ""
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-mono text-lg text-green-500">{getSourceIcon(task.source)}</span>
                      <h3
                        className={`font-mono text-sm font-semibold text-green-500 ${task.status === "completed" ? "line-through" : ""
                          }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                    {task.description && <p className="mb-2 font-mono text-xs text-green-500/70">{task.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      {task.priority && (
                        <Badge className={`font-mono text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      )}
                      {task.due_date && (
                        <Badge className="border-green-500/30 bg-green-500/10 font-mono text-xs text-green-500">
                          DUE: {new Date(task.due_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleToggleStatus(task.id, task.status)}
                    className="border border-green-500/30 bg-green-500/10 font-mono text-xs text-green-500 hover:bg-green-500/20"
                  >
                    {task.status === "completed" ? "UNDO" : "COMPLETE"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
