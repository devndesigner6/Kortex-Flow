import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

const eventAnalysisSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Task title related to the event"),
      description: z.string().describe("What needs to be done for this event"),
      due_date: z.string().describe("When this task should be completed (before the event)"),
      priority: z.enum(["low", "medium", "high", "urgent"]).describe("Priority based on event timing"),
    }),
  ),
})

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get upcoming events that need confirmation or preparation
    const { data: events } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", new Date().toISOString())
      .limit(10)

    if (!events || events.length === 0) {
      return NextResponse.json({ extracted: 0, message: "No upcoming events found" })
    }

    let totalTasksCreated = 0

    // Process events that need confirmation or preparation
    for (const event of events) {
      if (!event.needs_confirmation && !event.description) {
        continue // Skip events that don't need action
      }

      const eventContent = `
Event: ${event.title}
Start: ${event.start_time}
End: ${event.end_time}
Location: ${event.location || "Not specified"}
Description: ${event.description || "No description"}
Needs Confirmation: ${event.needs_confirmation ? "Yes" : "No"}
Attendees: ${event.attendees?.join(", ") || "None"}
      `

      // Use AI to generate preparation tasks
      const { object } = await generateObject({
        model: "openai/gpt-5-mini",
        schema: eventAnalysisSchema,
        prompt: `Analyze this calendar event and suggest actionable preparation tasks.

Consider:
- If confirmation is needed, create a task to confirm attendance
- If there's a location, suggest checking directions or travel time
- If there are attendees, suggest preparation tasks (agenda, materials, etc.)
- Based on the event type, suggest relevant preparation

Event details:
${eventContent}`,
      })

      // Insert extracted tasks
      if (object.tasks.length > 0) {
        const tasksToInsert = object.tasks.map((task) => ({
          user_id: user.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: "pending",
          source: "calendar",
          source_id: event.google_event_id,
        }))

        const { error } = await supabase.from("tasks").insert(tasksToInsert)

        if (error) {
          console.error("[v0] Error inserting event tasks:", error)
        } else {
          totalTasksCreated += tasksToInsert.length
        }
      }
    }

    return NextResponse.json({
      extracted: totalTasksCreated,
      analyzed_events: events.length,
      message: `Successfully created ${totalTasksCreated} preparation tasks from ${events.length} events`,
    })
  } catch (error) {
    console.error("[v0] Event analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze events" }, { status: 500 })
  }
}
