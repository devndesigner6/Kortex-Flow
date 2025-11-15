"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  priority: string | null
  status: string
  source: string | null
}

interface Event {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
}

interface Email {
  id: string
  subject: string
  sender: string
  snippet: string | null
  received_at: string
  processed: boolean
}

interface QuickStatsProps {
  tasks: Task[]
  events: Event[]
  emails: Email[]
}

export function QuickStats({ tasks, events, emails }: QuickStatsProps) {
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const [localTasks, setLocalTasks] = useState(tasks)
  const router = useRouter()
  const supabase = createClient()

  const pendingTasks = localTasks.filter((t) => t.status === "pending")
  const urgentTasks = localTasks.filter((t) => t.priority === "urgent")
  const unprocessedEmails = emails.filter((e) => !e.processed)

  const stats = [
    {
      label: "TASK_QUEUE",
      value: pendingTasks.length,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      items: pendingTasks,
      type: "tasks",
    },
    {
      label: "CRITICAL_PRIORITY",
      value: urgentTasks.length,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      items: urgentTasks,
      type: "tasks",
    },
    {
      label: "SCHEDULE_PROTOCOL",
      value: events.length,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      items: events,
      type: "events",
    },
    {
      label: "INBOX_FEED_RAW",
      value: unprocessedEmails.length,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      items: unprocessedEmails,
      type: "emails",
    },
  ]

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed"

    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

    if (!error) {
      setLocalTasks(localTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
      router.refresh()
    }
  }

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

  return (
    <>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.border} ${stat.bg} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]`}
            onClick={() => setSelectedStat(selectedStat === stat.label ? null : stat.label)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-foreground/70 sm:text-sm">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-mono text-2xl font-bold ${stat.color} sm:text-3xl`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStat && (
        <div className="mt-6 animate-slide-in">
          {stats
            .filter((s) => s.label === selectedStat)
            .map((stat) => (
              <Card key={stat.label} className={`${stat.border} ${stat.bg}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-xl">{stat.label.replace(/_/g, " ")}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedStat(null)}
                      className="text-foreground/50 hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.items.length === 0 ? (
                    <p className="font-mono text-sm text-muted-foreground">No items found.</p>
                  ) : (
                    <div className="space-y-3">
                      {stat.type === "tasks" &&
                        (stat.items as Task[]).map((task) => (
                          <div key={task.id} className="rounded-lg border border-primary/20 bg-background/50 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="font-serif text-sm font-medium text-foreground">{task.title}</h3>
                                {task.description && (
                                  <p className="mt-1 font-mono text-xs text-muted-foreground">{task.description}</p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {task.priority && (
                                    <Badge className={`font-mono text-xs ${getPriorityColor(task.priority)}`}>
                                      {task.priority.toUpperCase()}
                                    </Badge>
                                  )}
                                  {task.due_date && (
                                    <Badge className="border-primary/30 bg-primary/10 font-mono text-xs text-primary">
                                      {new Date(task.due_date).toLocaleDateString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleToggleTask(task.id, task.status)}
                                className="shrink-0 border border-primary/30 bg-primary/10 font-mono text-xs text-primary hover:bg-primary/20"
                              >
                                COMPLETE
                              </Button>
                            </div>
                          </div>
                        ))}

                      {stat.type === "events" &&
                        (stat.items as Event[]).map((event) => (
                          <div key={event.id} className="rounded-lg border border-primary/20 bg-background/50 p-3">
                            <h3 className="font-serif text-sm font-medium text-foreground">{event.title}</h3>
                            {event.description && (
                              <p className="mt-1 font-mono text-xs text-muted-foreground">{event.description}</p>
                            )}
                            <div className="mt-2 flex gap-2">
                              <Badge className="border-blue-500/30 bg-blue-500/10 font-mono text-xs text-blue-500">
                                {new Date(event.start_time).toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        ))}

                      {stat.type === "emails" &&
                        (stat.items as Email[]).map((email) => (
                          <div key={email.id} className="rounded-lg border border-primary/20 bg-background/50 p-3">
                            <h3 className="font-serif text-sm font-medium text-foreground">{email.subject}</h3>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">From: {email.sender}</p>
                            {email.snippet && (
                              <p className="mt-1 font-mono text-xs text-muted-foreground">{email.snippet}</p>
                            )}
                            <Badge className="mt-2 border-green-500/30 bg-green-500/10 font-mono text-xs text-green-500">
                              {new Date(email.received_at).toLocaleString()}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </>
  )
}
