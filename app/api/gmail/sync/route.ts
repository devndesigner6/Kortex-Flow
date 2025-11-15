import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { refreshGoogleToken } from "@/lib/google-oauth"

export async function POST() {
  console.log("[v0] Gmail sync API called")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] User:", user?.id)

  if (!user) {
    console.error("[v0] No user found")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("gmail_access_token, gmail_refresh_token")
      .eq("id", user.id)
      .single()

    console.log("[v0] Profile fetch result:", { hasProfile: !!profile, error: profileError })

    if (profileError) {
      console.error("[v0] Profile fetch error:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    if (!profile?.gmail_access_token) {
      console.error("[v0] No Gmail access token found")
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 })
    }

    let accessToken = profile.gmail_access_token
    console.log("[v0] Starting Gmail fetch with access token (length:", accessToken.length, ")")

    // Use Gmail's category labels: CATEGORY_PRIMARY for important emails, -CATEGORY_PROMOTIONS and -CATEGORY_UPDATES to exclude
    const query = "category:primary -category:promotions -category:updates"
    const gmailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=${encodeURIComponent(query)}`

    let gmailResponse = await fetch(gmailUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    console.log("[v0] Initial Gmail API response status:", gmailResponse.status)

    if (gmailResponse.status === 401 && profile.gmail_refresh_token) {
      console.log("[v0] Access token expired, attempting refresh...")
      try {
        const newToken = await refreshGoogleToken(profile.gmail_refresh_token)

        if (newToken) {
          console.log("[v0] Token refreshed successfully, updating database...")
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ gmail_access_token: newToken })
            .eq("id", user.id)

          if (updateError) {
            console.error("[v0] Failed to update token:", updateError)
          }

          accessToken = newToken

          gmailResponse = await fetch(gmailUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          console.log("[v0] Retry response status:", gmailResponse.status)
        } else {
          console.error("[v0] Token refresh returned null")
          return NextResponse.json({ error: "Token expired. Please reconnect Gmail." }, { status: 401 })
        }
      } catch (refreshError) {
        console.error("[v0] Token refresh error:", refreshError)
        return NextResponse.json({ error: "Token refresh failed. Please reconnect Gmail." }, { status: 401 })
      }
    }

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text()
      console.error("[v0] Gmail API error:", gmailResponse.status, errorText)
      return NextResponse.json(
        { error: `Gmail API error: ${gmailResponse.status}. Please try reconnecting Gmail.` },
        { status: gmailResponse.status },
      )
    }

    const gmailData = await gmailResponse.json()
    console.log("[v0] Fetched", gmailData.messages?.length || 0, "primary message IDs (excluding promotions/updates)")

    if (!gmailData.messages || gmailData.messages.length === 0) {
      console.log("[v0] No messages found")
      return NextResponse.json({ synced: 0 })
    }

    const emailPromises = gmailData.messages.slice(0, 50).map(async (message: { id: string }) => {
      try {
        const messageResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!messageResponse.ok) {
          console.error("[v0] Failed to fetch message:", message.id, messageResponse.status)
          return null
        }
        return messageResponse.json()
      } catch (err) {
        console.error("[v0] Error fetching message:", message.id, err)
        return null
      }
    })

    const fullMessages = (await Promise.all(emailPromises)).filter((msg) => msg !== null)
    console.log("[v0] Fetched full details for", fullMessages.length, "messages")

    if (fullMessages.length === 0) {
      console.log("[v0] No valid messages to sync")
      return NextResponse.json({ synced: 0 })
    }

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
        body: body.substring(0, 5000),
        received_at: date ? new Date(date).toISOString() : new Date().toISOString(),
        processed: false,
      }
    })

    console.log("[v0] Upserting", emailsToInsert.length, "emails...")
    const { error: upsertError } = await supabase.from("emails").upsert(emailsToInsert, {
      onConflict: "gmail_id",
      ignoreDuplicates: false,
    })

    if (upsertError) {
      console.error("[v0] Error upserting emails:", upsertError)
      return NextResponse.json({ error: `Database error: ${upsertError.message}` }, { status: 500 })
    }

    console.log("[v0] Successfully synced", emailsToInsert.length, "primary emails")
    return NextResponse.json({ synced: emailsToInsert.length })
  } catch (error) {
    console.error("[v0] Gmail sync error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Failed to sync emails: ${errorMessage}` }, { status: 500 })
  }
}
