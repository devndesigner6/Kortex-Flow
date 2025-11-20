import { NextResponse } from "next/server"
import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"

export async function POST(request: Request) {
  try {
    // Firebase initialized via helpers
    const { user, error: authError } = await getAuthenticatedUser(request)

    if (!user || authError) {
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

    const { error } = await db.collection("tasks").add(tasksToInsert)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating tasks:", error)
    return NextResponse.json({ error: "Failed to create tasks" }, { status: 500 })
  }
}



