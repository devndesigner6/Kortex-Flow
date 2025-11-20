import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"
import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/google-ai"

export async function POST(request: Request) {
  try {
    // Firebase initialized via helpers

    const { user, error: authError } = await getAuthenticatedUser(request)

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, sender, body, tone = "professional" } = await request.json()

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const toneInstructions = {
      professional: "Write in a professional, courteous tone. Use formal language.",
      casual: "Write in a friendly, casual tone. Be warm and approachable.",
      brief: "Write a very brief, concise reply. Get straight to the point.",
      detailed: "Write a detailed, comprehensive reply. Provide thorough explanations.",
    }

    const prompt = `Generate an email reply with the following details:

Original Email:
Subject: ${subject}
From: ${sender}
Body: ${body}

Tone: ${tone}
Instructions: ${toneInstructions[tone as keyof typeof toneInstructions]}

Generate ONLY the reply text (no subject line, no "Dear...", just the body of the reply). Make it helpful, clear, and appropriate for the context.`

    const text = await generateWithGemini(prompt)

    return NextResponse.json({ reply: text.trim() })
  } catch (error) {
    console.error("[v0] Error generating reply:", error)
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 })
  }
}


