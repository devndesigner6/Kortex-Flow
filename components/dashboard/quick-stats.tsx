import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickStatsProps {
  tasks: Array<{ status: string; priority: string }>
  events: Array<unknown>
  emails: Array<{ processed: boolean }>
}

export function QuickStats({ tasks, events, emails }: QuickStatsProps) {
  const pendingTasks = tasks.filter((t) => t.status === "pending").length
  const urgentTasks = tasks.filter((t) => t.priority === "urgent").length
  const unprocessedEmails = emails.filter((e) => !e.processed).length

  const stats = [
    { label: "PENDING_TASKS", value: pendingTasks, color: "text-yellow-500" },
    { label: "URGENT_TASKS", value: urgentTasks, color: "text-red-500" },
    { label: "UPCOMING_EVENTS", value: events.length, color: "text-blue-500" },
    { label: "UNPROCESSED_EMAILS", value: unprocessedEmails, color: "text-green-500" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-green-500/20 bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-xs text-green-500/70">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
