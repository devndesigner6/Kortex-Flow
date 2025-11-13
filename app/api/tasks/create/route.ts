import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] ========== Task Creation API Called ==========")

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] ERROR: No authenticated user")
      return NextResponse.json({ error: "Unauthorized", details: "No authenticated user found" }, { status: 401 })
    }

    console.log("[v0] Authenticated user ID:", user.id)

    let body
    try {
      body = await request.json()
      console.log("[v0] Request body received:", JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error("[v0] ERROR: Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body", details: "Could not parse JSON" }, { status: 400 })
    }

    const task = body.task || body
    console.log("[v0] Task object extracted:", JSON.stringify(task, null, 2))

    if (!task.title) {
      console.log("[v0] ERROR: Missing required field: title")
      return NextResponse.json({ error: "Missing required field", details: "title is required" }, { status: 400 })
    }

    const validPriorities = ["low", "medium", "high", "urgent"]
    let priority = (task.priority || "medium").toLowerCase()

    // Map "normal" to "medium" for backward compatibility
    if (priority === "normal") {
      priority = "medium"
    }

    // Validate and default to "medium" if invalid
    if (!validPriorities.includes(priority)) {
      console.log("[v0] Invalid priority:", task.priority, "- defaulting to medium")
      priority = "medium"
    }

    const taskData = {
      user_id: user.id,
      title: String(task.title),
      description: task.description ? String(task.description) : "",
      priority: priority,
      due_date: task.dueDate || task.due_date || null,
      status: task.status || "pending",
      source: task.source || "manual",
      source_id: task.sourceId || task.source_id || null,
    }

    console.log("[v0] Final task data for database:", JSON.stringify(taskData, null, 2))

    const { data, error } = await supabase.from("tasks").insert(taskData).select()

    if (error) {
      console.error("[v0] DATABASE ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      )
    }

    if (!data || data.length === 0) {
      console.error("[v0] ERROR: No data returned from insert")
      return NextResponse.json({ error: "Task creation failed", details: "No data returned" }, { status: 500 })
    }

    console.log("[v0] SUCCESS: Task created:", JSON.stringify(data[0], null, 2))
    console.log("[v0] ========== Task Creation Complete ==========")

    return NextResponse.json({ success: true, task: data[0] }, { status: 200 })
  } catch (error) {
    console.error("[v0] UNEXPECTED ERROR:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
