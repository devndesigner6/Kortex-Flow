import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emails } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const prompt = `Analyze these emails and identify which ones need replies. For each email that needs a reply, generate an appropriate response.

Emails:
${emails
  .map(
    (email: any) => `
Subject: ${email.subject || "No subject"}
From: ${email.sender || "Unknown"}
Body: ${email.body || "No content"}
---
`,
  )
  .join("\n")}

Return a JSON object with this structure:
{
  "emailsNeedingReplies": [
    {
      "id": "email_id",
      "subject": "email subject",
      "sender": "sender email",
      "body": "email body",
      "received_at": "timestamp",
      "gmail_id": "gmail_id",
      "aiReply": "your generated professional reply",
      "needsReply": true,
      "reason": "why this email needs a reply"
    }
  ]
}

Only include emails that:
- Ask questions
- Request information or action
- Need acknowledgment
- Are time-sensitive

Do not include:
- Newsletters
- Automated notifications
- Spam
- Emails already replied to`

    const { text } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt,
      apiKey: process.env.GROQ_API_KEY,
    })

    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/```\s*$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/```\s*$/, "")
    }

    const result = JSON.parse(cleanedText)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error analyzing emails for replies:", error)
    return NextResponse.json({ error: "Failed to analyze emails" }, { status: 500 })
  }
}
