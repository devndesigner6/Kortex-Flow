import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AITaskExtractionContent } from "@/components/ai-tasks/ai-task-extraction-content"

export default async function AITasksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch emails
  const { data: emails } = await supabase
    .from("emails")
    .select("*")
    .eq("user_id", user.id)
    .order("received_at", { ascending: false })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  // Fetch calendar events
  const { data: events } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  return (
    <div className="page-transition min-h-screen w-full bg-background p-4 sm:p-6">
      <div className="animate-slide-in mx-auto w-full max-w-6xl">
        <AITaskExtractionContent emails={emails} events={events} />
      </div>
    </div>
  )
}
