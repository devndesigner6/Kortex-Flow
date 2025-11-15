"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Circle, Clock, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  created_at: string
}

export function TasksPageContent({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const router = useRouter()

  const refreshTasks = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

    if (data) {
      setTasks(data)
    }
  }

  // Refresh on mount and when window gains focus
  useEffect(() => {
    refreshTasks()

    const handleFocus = () => refreshTasks()
    window.addEventListener("focus", handleFocus)

    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const handleStatusToggle = async (taskId: string, currentStatus: string) => {
    const supabase = createClient()
    const newStatus = currentStatus === "pending" ? "completed" : "pending"

    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

    if (!error) {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    }
  }

  return (
    <div className="page-transition min-h-screen w-full bg-background p-4 sm:p-8">
      <div className="animate-slide-in mb-12 flex justify-center">
        <Link href="/dashboard" className="group relative">
          <div className="relative flex items-center gap-3 overflow-hidden rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-8 py-4 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30">
              <LayoutDashboard className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-serif relative text-lg uppercase tracking-wider text-primary sm:text-6xl">
              Return to Dashboard
            </span>
            <ArrowLeft className="relative h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-primary/50" />
            </div>
          </div>
        </Link>
      </div>

      <div className="mx-auto max-w-4xl animate-slide-in">
        <div className="mb-12 text-center">
          <h1 className="font-serif mb-3 text-5xl font-normal text-primary sm:text-6xl">Your Tasks</h1>
          <p className="font-serif text-lg italic text-muted-foreground">manage everything in one place</p>
        </div>

        <div className="mb-8 flex justify-center gap-3">
          {(["all", "pending", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={`font-mono text-xs uppercase tracking-wider transition-all duration-300 ${filter === f ? "glow-button bg-primary/20 text-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "border-primary/30 text-primary/70 hover:scale-105 hover:border-primary/50 hover:text-primary"}`}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="py-16 text-center">
                <p className="font-mono text-sm text-green-500/70">NO_TASKS_FOUND. System idle.</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task, index) => (
              <Card
                key={task.id}
                className="group border-green-500/20 bg-green-500/5 transition-all duration-300 hover:scale-[1.01] hover:border-green-500/40 hover:bg-green-500/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-serif text-2xl text-green-500">{task.title}</h3>
                      {task.description && <p className="font-serif italic text-green-500/70">{task.description}</p>}
                      <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                        <span
                          className={`rounded px-2 py-1 ${
                            task.priority === "urgent"
                              ? "bg-red-500/20 text-red-500"
                              : task.priority === "high"
                                ? "bg-orange-500/20 text-orange-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        {task.due_date && (
                          <span className="flex items-center gap-1 text-green-500/70">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusToggle(task.id, task.status)}
                      className="mt-1 transition-transform hover:scale-110"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-7 w-7 text-green-500" />
                      ) : (
                        <Circle className="h-7 w-7 text-green-500/50" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
