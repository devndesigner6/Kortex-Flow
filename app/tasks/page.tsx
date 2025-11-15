import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TasksPageContent } from "@/components/tasks/tasks-page-content"

export default async function TasksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all user tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  return <TasksPageContent tasks={tasks} />
}
