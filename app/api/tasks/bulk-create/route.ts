import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tasks } = await request.json()

    const tasksToInsert = tasks.map((task: any) => ({
      user_id: user.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.dueDate || null,
      status: "pending",
    }))

    const { error } = await supabase.from("tasks").insert(tasksToInsert)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating tasks:", error)
    return NextResponse.json({ error: "Failed to create tasks" }, { status: 500 })
  }
}
