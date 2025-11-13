import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentEmails } from "@/components/dashboard/recent-emails"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { AddTaskForm } from "@/components/dashboard/add-task-form"
import { TasksNavigationOrb } from "@/components/dashboard/tasks-navigation-orb"
import { AIFeaturesNavigation } from "@/components/dashboard/ai-features-navigation"
import { CircularConnections } from "@/components/dashboard/circular-connections"
import { KortexFlowFooter } from "@/components/dashboard/kortexflow-footer"
import { ConnectWalletButton } from "@/components/dashboard/connect-wallet-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { error: dbError } = await supabase.from("profiles").select("id").limit(1)

  if (dbError && dbError.message.includes("relation")) {
    redirect("/setup")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("gmail_access_token, calendar_access_token, full_name")
    .eq("id", user.id)
    .single()
    .then((res) => ({ data: res.data || null }))
    .catch(() => ({ data: null }))

  const isGmailConnected = !!profile?.gmail_access_token
  const isCalendarConnected = !!profile?.calendar_access_token

  // Fetch user's tasks with error handling
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  // Fetch upcoming calendar events with error handling
  const { data: events } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(5)
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  // Fetch recent emails with error handling
  const { data: emails } = await supabase
    .from("emails")
    .select("*")
    .eq("user_id", user.id)
    .order("received_at", { ascending: false })
    .limit(5)
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  return (
    <div className="page-transition min-h-screen w-full overflow-x-hidden bg-background px-3 py-4 transition-colors duration-300 sm:px-4 sm:py-6">
      <div className="animate-slide-in mx-auto w-full max-w-6xl space-y-6">
        <DashboardHeader user={user} profile={profile} />

        <div className="space-y-4">
          <CircularConnections isGmailConnected={isGmailConnected} isCalendarConnected={isCalendarConnected} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <TasksNavigationOrb />
            <AIFeaturesNavigation />
          </div>
        </div>

        <div className="flex justify-center">
          <ConnectWalletButton />
        </div>

        <QuickStats tasks={tasks} events={events} emails={emails} />

        <div className="grid gap-4 lg:grid-cols-2">
          <UpcomingEvents events={events} />
          <RecentEmails emails={emails} />
        </div>

        <AddTaskForm />

        <KortexFlowFooter />
      </div>
    </div>
  )
}
