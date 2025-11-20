import { redirect } from "next/navigation"
import { getServerSession, firestore } from "@/lib/firebase/helpers"
import { TasksPageContent } from "@/components/tasks/tasks-page-content"

export default async function TasksPage() {
  const { user, error: authError } = await getServerSession()

  if (!user || authError) {
    redirect("/auth/login")
  }

  // Fetch all user tasks
  const { data: tasks } = await firestore
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  return <TasksPageContent tasks={tasks} />
}
