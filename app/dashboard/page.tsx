import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TaskList } from "@/components/dashboard/task-list"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentEmails } from "@/components/dashboard/recent-emails"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { GmailConnectButton } from "@/components/dashboard/gmail-connect-button"
import { CalendarConnectButton } from "@/components/dashboard/calendar-connect-button"
import { AIExtractButton } from "@/components/dashboard/ai-extract-button"

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
    .select("gmail_access_token, calendar_access_token")
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
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader user={user} />

        {(!isGmailConnected || !isCalendarConnected) && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-yellow-500">OAUTH_SETUP_REQUIRED</p>
                <p className="font-mono text-xs text-yellow-500/70">
                  Having trouble connecting? Check the diagnostics page for setup instructions.
                </p>
              </div>
              <a
                href="/diagnostics"
                className="rounded border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 font-mono text-sm text-yellow-500 hover:bg-yellow-500/20"
              >
                VIEW_DIAGNOSTICS
              </a>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-cyan-500">AI_TASK_EXTRACTION</p>
              <p className="font-mono text-xs text-cyan-500/70">
                Use AI to automatically extract tasks from your emails and calendar events
              </p>
            </div>
            <AIExtractButton />
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div>
              <p className="font-mono text-sm text-green-500">
                {isGmailConnected ? "GMAIL_STATUS: CONNECTED" : "GMAIL_STATUS: NOT_CONNECTED"}
              </p>
              <p className="font-mono text-xs text-green-500/70">
                {isGmailConnected ? "Click SYNC to fetch latest emails" : "Connect your Gmail to start syncing"}
              </p>
            </div>
            <GmailConnectButton isConnected={isGmailConnected} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div>
              <p className="font-mono text-sm text-green-500">
                {isCalendarConnected ? "CALENDAR_STATUS: CONNECTED" : "CALENDAR_STATUS: NOT_CONNECTED"}
              </p>
              <p className="font-mono text-xs text-green-500/70">
                {isCalendarConnected ? "Click SYNC to fetch upcoming events" : "Connect your Calendar to start syncing"}
              </p>
            </div>
            <CalendarConnectButton isConnected={isCalendarConnected} />
          </div>
        </div>

        <QuickStats tasks={tasks} events={events} emails={emails} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TaskList tasks={tasks} />
          <div className="flex flex-col gap-6">
            <UpcomingEvents events={events} />
            <RecentEmails emails={emails} />
          </div>
        </div>
      </div>
    </div>
  )
}
