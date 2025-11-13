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
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

  let profile = null
  try {
    const result = await supabase
      .from("profiles")
      .select("gmail_access_token, calendar_access_token, full_name")
      .eq("id", user.id)
      .single()
    profile = result.data
  } catch (error) {
    profile = null
  }

  const isGmailConnected = !!profile?.gmail_access_token
  const isCalendarConnected = !!profile?.calendar_access_token

  // Fetch user's tasks with error handling
  let tasks = []
  try {
    const result = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true })
    tasks = result.data || []
  } catch (error) {
    tasks = []
  }

  // Fetch upcoming calendar events with error handling
  let events = []
  try {
    const result = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(5)
    events = result.data || []
  } catch (error) {
    events = []
  }

  // Fetch recent emails with error handling
  let emails = []
  try {
    const result = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", user.id)
      .order("received_at", { ascending: false })
      .limit(5)
    emails = result.data || []
  } catch (error) {
    emails = []
  }

  return (
    <div className="page-transition min-h-screen w-full overflow-x-hidden bg-background p-4 transition-colors duration-300 sm:p-6">
      <div className="animate-slide-in mx-auto w-full max-w-7xl">
        <DashboardHeader user={user} profile={profile} />

        <CircularConnections isGmailConnected={isGmailConnected} isCalendarConnected={isCalendarConnected} />

        <TasksNavigationOrb />

        <AIFeaturesNavigation />

        {/* Connect Wallet Button */}
        <div className="mb-6 flex justify-center">
          <Link href="/blockchain">
            <button className="group relative overflow-hidden rounded-lg border border-green-500/30 bg-black px-6 py-3 font-mono text-green-500 transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider sm:text-base">
                Connect Wallet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </Link>
        </div>

        <QuickStats tasks={tasks} events={events} emails={emails} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <UpcomingEvents events={events} />
            <AddTaskForm />
          </div>
          <div className="flex flex-col gap-6">
            <RecentEmails emails={emails} />
          </div>
        </div>
      </div>
    </div>
  )
}
