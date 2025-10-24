import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state") // user_id

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=calendar_auth_failed", request.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/callback`,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    // Store tokens in database
    const supabase = await createClient()

    await supabase
      .from("profiles")
      .update({
        calendar_access_token: tokens.access_token,
        calendar_refresh_token: tokens.refresh_token,
      })
      .eq("id", state)

    return NextResponse.redirect(new URL("/dashboard?calendar_connected=true", request.url))
  } catch (error) {
    console.error("[v0] Calendar OAuth error:", error)
    return NextResponse.redirect(new URL("/dashboard?error=calendar_auth_failed", request.url))
  }
}
