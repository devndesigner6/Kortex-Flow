import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { refreshGoogleToken } from "@/lib/google-oauth"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageId, subject, replyText } = await request.json()

    const { data: profile } = await supabase
      .from("profiles")
      .select("gmail_access_token, gmail_refresh_token")
      .eq("id", user.id)
      .single()

    if (!profile?.gmail_access_token) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 })
    }

    let accessToken = profile.gmail_access_token

    // Create RFC 2822 formatted email
    const email = [
      `To: ${user.email}`,
      `Subject: Re: ${subject}`,
      `In-Reply-To: ${messageId}`,
      `References: ${messageId}`,
      "",
      replyText,
    ].join("\r\n")

    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // Send reply using Gmail API
    let response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
        threadId: messageId,
      }),
    })

    // If token expired, refresh and retry
    if (response.status === 401 && profile.gmail_refresh_token) {
      console.log("[v0] Gmail access token expired, refreshing...")
      const newToken = await refreshGoogleToken(profile.gmail_refresh_token, user.id, "gmail")
      if (newToken) {
        accessToken = newToken
        response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            raw: encodedEmail,
            threadId: messageId,
          }),
        })
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to send email:", errorText)
      return NextResponse.json({ error: "Failed to send email" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending email reply:", error)
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}
