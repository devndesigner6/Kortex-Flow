import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

const taskSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Brief title of the task"),
      description: z.string().describe("Detailed description of what needs to be done"),
      due_date: z.string().nullable().describe("Due date in ISO format if mentioned, null otherwise"),
      priority: z.enum(["low", "medium", "high", "urgent"]).describe("Priority level based on urgency indicators"),
      source_id: z.string().describe("The email or event ID this task came from"),
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
    // Get unprocessed emails
    const { data: emails } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", user.id)
      .eq("processed", false)
      .limit(10)

    if (!emails || emails.length === 0) {
      return NextResponse.json({ extracted: 0, message: "No unprocessed emails found" })
    }

    let totalTasksCreated = 0

    // Process each email with AI
    for (const email of emails) {
      const emailContent = `
Subject: ${email.subject}
From: ${email.sender}
Date: ${email.received_at}

Body:
${email.body}
      `

      // Use AI to extract tasks from email
      const { object } = await generateObject({
        model: "openai/gpt-5-mini",
        schema: taskSchema,
        prompt: `Analyze this email and extract any actionable tasks, deadlines, or meetings that need to be scheduled or confirmed. 
        
Only extract items that require action from the recipient. Ignore promotional content, newsletters, or informational emails unless they contain specific action items.

For each task:
- Create a clear, actionable title
- Include relevant context in the description
- Identify any mentioned deadlines or dates
- Assess priority based on urgency words (ASAP, urgent, deadline, etc.)

Email content:
${emailContent}`,
      })

      // Insert extracted tasks into database
      if (object.tasks.length > 0) {
        const tasksToInsert = object.tasks.map((task) => ({
          user_id: user.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: "pending",
          source: "email",
          source_id: email.gmail_id,
        }))

        const { error } = await supabase.from("tasks").insert(tasksToInsert)

        if (error) {
          console.error("[v0] Error inserting tasks:", error)
        } else {
          totalTasksCreated += tasksToInsert.length
        }
      }

      // Mark email as processed
      await supabase.from("emails").update({ processed: true }).eq("id", email.id)
    }

    return NextResponse.json({
      extracted: totalTasksCreated,
      processed_emails: emails.length,
      message: `Successfully extracted ${totalTasksCreated} tasks from ${emails.length} emails`,
    })
  } catch (error) {
    console.error("[v0] AI extraction error:", error)
    return NextResponse.json({ error: "Failed to extract tasks" }, { status: 500 })
  }
}
