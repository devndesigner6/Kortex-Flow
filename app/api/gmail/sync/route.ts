import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's Gmail tokens
    const { data: profile } = await supabase.from("profiles").select("gmail_access_token").eq("id", user.id).single()

    if (!profile?.gmail_access_token) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 })
    }

    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100", {
      headers: {
        Authorization: `Bearer ${profile.gmail_access_token}`,
      },
    })

    const gmailData = await gmailResponse.json()

    if (!gmailData.messages) {
      return NextResponse.json({ synced: 0 })
    }

    // Fetch full message details for each email
    const emailPromises = gmailData.messages.map(async (message: { id: string }) => {
      const messageResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
        headers: {
          Authorization: `Bearer ${profile.gmail_access_token}`,
        },
      })
      return messageResponse.json()
    })

    const fullMessages = await Promise.all(emailPromises)

    // Parse and store emails
    const emailsToInsert = fullMessages.map((msg) => {
      const headers = msg.payload.headers
      const subject = headers.find((h: { name: string }) => h.name === "Subject")?.value || "No Subject"
      const from = headers.find((h: { name: string }) => h.name === "From")?.value || "Unknown"
      const date = headers.find((h: { name: string }) => h.name === "Date")?.value

      // Get email body
      let body = ""
      if (msg.payload.body.data) {
        body = Buffer.from(msg.payload.body.data, "base64").toString("utf-8")
      } else if (msg.payload.parts) {
        const textPart = msg.payload.parts.find((part: { mimeType: string }) => part.mimeType === "text/plain")
        if (textPart?.body.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8")
        }
      }

      return {
        user_id: user.id,
        gmail_id: msg.id,
        subject,
        sender: from,
        body: body.substring(0, 5000), // Limit body length
        received_at: date ? new Date(date).toISOString() : new Date().toISOString(),
        processed: false,
      }
    })

    // Insert emails (ignore duplicates)
    const { error } = await supabase.from("emails").upsert(emailsToInsert, {
      onConflict: "gmail_id",
      ignoreDuplicates: true,
    })

    if (error) {
      console.error("[v0] Error inserting emails:", error)
      throw error
    }

    return NextResponse.json({ synced: emailsToInsert.length })
  } catch (error) {
    console.error("[v0] Gmail sync error:", error)
    return NextResponse.json({ error: "Failed to sync emails" }, { status: 500 })
  }
}
