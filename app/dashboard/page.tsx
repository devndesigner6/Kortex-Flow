import { redirect } from 'next/navigation'
import { getServerSession, firestore } from "@/lib/firebase/helpers"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentEmails } from "@/components/dashboard/recent-emails"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { AddTaskForm } from "@/components/dashboard/add-task-form"
import { TasksNavigationOrb } from "@/components/dashboard/tasks-navigation-orb"
import { AIFeaturesNavigation } from "@/components/dashboard/ai-features-navigation"
import { CircularConnections } from "@/components/dashboard/circular-connections"
import { KortexFlowFooter } from "@/components/dashboard/kortexflow-footer"

export default async function DashboardPage() {
  const { user, error: authError } = await getServerSession()

  if (!user || authError) {
    redirect("/auth/login")
  }

  const { data: profile } = await firestore
    .from("profiles")
    .select("gmail_access_token, calendar_access_token, full_name")
    .eq("id", user.id)
    .single()
    .then((res) => ({ data: res.data || null }))
    .catch((err) => {
      console.error("[Dashboard] Profile fetch error:", err)
      return { data: null }
    })

  console.log("[Dashboard] User ID:", user.id)
  console.log("[Dashboard] Profile:", profile)
  console.log("[Dashboard] Has Gmail token:", !!profile?.gmail_access_token)

  const isGmailConnected = !!profile?.gmail_access_token
  const isCalendarConnected = !!profile?.calendar_access_token

  // Fetch user's tasks with error handling
  const { data: tasks } = await firestore
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  // Fetch upcoming calendar events with error handling
  const { data: events } = isCalendarConnected
    ? await firestore
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(5)
        .then((res) => ({ data: res.data || [] }))
        .catch(() => ({ data: [] }))
    : { data: [] }

  // Fetch recent emails with error handling  
  console.log("[Dashboard] isGmailConnected:", isGmailConnected)
  let emails: any[] = []
  if (isGmailConnected) {
    try {
      const { adminDb } = await import("@/lib/firebase/admin")
      // Fetch all emails for user, then sort in memory to avoid index requirement
      const emailsSnapshot = await adminDb
        .collection("emails")
        .where("user_id", "==", user.id)
        .get()
      
      emails = emailsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a: any, b: any) => {
          const dateA = a.received_at ? new Date(a.received_at).getTime() : 0
          const dateB = b.received_at ? new Date(b.received_at).getTime() : 0
          return dateB - dateA // descending order
        })
        .slice(0, 5) // limit to 5
      
      console.log("[Dashboard] Emails fetched:", emails.length)
    } catch (err) {
      console.error("[Dashboard] Email fetch error:", err)
    }
  }
  
  console.log("[Dashboard] Final emails count:", emails.length)

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
