import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { emails, events } = await request.json()

    if ((!emails || emails.length === 0) && (!events || events.length === 0)) {
      return NextResponse.json({ tasks: [], message: "No emails or events to analyze" })
    }

    const limitedEmails = (emails || []).slice(0, 10)
    const limitedEvents = (events || []).slice(0, 10)

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const content = `
EMAILS:
${limitedEmails?.map((e: any) => `Subject: ${e.subject?.substring(0, 100) || "No subject"}\nFrom: ${e.sender?.substring(0, 50) || "Unknown"}\nBody: ${e.body?.substring(0, 200) || "No content"}`).join("\n\n") || "None"}

CALENDAR EVENTS:
${limitedEvents?.map((e: any) => `Title: ${e.title?.substring(0, 100) || "No title"}\nDescription: ${e.description?.substring(0, 150) || "No description"}\nTime: ${e.start_time}`).join("\n\n") || "None"}
    `

    console.log("[v0] Content length:", content.length, "characters")

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an intelligent task extraction assistant. Analyze these emails and calendar events to extract ONLY actionable tasks.

**Extract tasks if content contains:**
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

For each task provide:
- title: clear, actionable title (verb + object, max 80 chars)
- description: relevant context (max 200 chars)
- dueDate: ISO date string or null
- priority: "urgent", "high", "medium", or "low"
- source: "email" or "event"
- sourceDetails: brief source reference (sender/event name)

Return ONLY a valid JSON object with this structure:
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "dueDate": "string or null",
      "priority": "urgent|high|medium|low",
      "source": "email|event",
      "sourceDetails": "string"
    }
  ]
}

Content to analyze:
${content}`,
    })

    // Parse the JSON response
    let parsed
    try {
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      parsed = JSON.parse(cleanedText)
    } catch (e) {
      console.error("[v0] Failed to parse AI response:", text)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    const tasks = (parsed.tasks || []).map((task: any, index: number) => ({
      ...task,
      id: `task-${Date.now()}-${index}`,
    }))

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("[v0] AI extraction error:", error)
    return NextResponse.json({ error: "Failed to extract tasks" }, { status: 500 })
  }
}
