import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

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

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    })

    for (const email of emails) {
      const emailContent = `
Subject: ${email.subject}
From: ${email.sender}
Date: ${email.received_at}

Body:
${email.body}
      `

      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: `You are an intelligent task extraction assistant. Analyze this email and extract ONLY actionable tasks, meetings that need confirmation, or deadlines.

**Extract tasks if the email contains:**
- Direct action requests ("Please review", "Can you send", "Need you to")
- Meeting invitations or scheduling requests
- Explicit deadlines or due dates
- Follow-up requests
- Deliverables or commitments

**DO NOT extract tasks for:**
- Newsletters or marketing emails
- Automated notifications without action needed
- General information or FYI emails
- Social media notifications
- Confirmations that don't require response

For each task provide:
- title: clear, actionable title (verb + object)
- description: relevant context
- due_date: ISO date string or null
- priority: "urgent", "high", "medium", or "low"
- category: "work", "personal", "meeting", "deadline", or "follow-up"

Return ONLY a valid JSON object with this structure:
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "due_date": "string or null",
      "priority": "urgent|high|medium|low",
      "category": "work|personal|meeting|deadline|follow-up"
    }
  ]
}

Email content:
${emailContent}`,
      })

      // Parse the JSON response
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch (e) {
        console.error("[v0] Failed to parse AI response:", text)
        continue
      }

      // Insert extracted tasks into database
      if (parsed.tasks && parsed.tasks.length > 0) {
        const tasksToInsert = parsed.tasks.map((task: any) => ({
          user_id: user.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          priority: task.priority,
          status: "pending",
          source: "email",
          source_id: email.gmail_id,
          metadata: { category: task.category },
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
