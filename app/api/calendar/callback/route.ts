import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] ===== CALENDAR CALLBACK STARTED =====")
  console.log("[v0] Full URL:", request.url)

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state") // user_id
  const error = searchParams.get("error")

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/calendar/callback`

  console.log("[v0] Callback params:", {
    hasCode: !!code,
    state,
    error,
    origin,
    redirectUri,
  })

  if (error) {
    console.error("[v0] OAuth error from Google:", error)
    return NextResponse.redirect(new URL(`/dashboard?error=calendar_oauth_error&details=${error}`, request.url))
  }

  if (!code || !state) {
    console.error("[v0] Missing code or state in callback")
    return NextResponse.redirect(new URL("/dashboard?error=calendar_missing_params", request.url))
  }

  try {
    console.log("[v0] Exchanging code for tokens...")
    console.log("[v0] Using redirect URI:", redirectUri)

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
        redirect_uri: redirectUri, // Use dynamic redirect URI
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()
    console.log("[v0] Token response status:", tokenResponse.status)
    console.log("[v0] Token response:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      error: tokens.error,
      errorDescription: tokens.error_description,
    })

    if (!tokens.access_token) {
      console.error("[v0] No access token received. Full response:", tokens)
      throw new Error(`Token exchange failed: ${tokens.error_description || tokens.error || "Unknown error"}`)
    }

    // Store tokens in database
    const supabase = await createClient()

    console.log("[v0] Updating profile with tokens for user:", state)

    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        calendar_access_token: tokens.access_token,
        calendar_refresh_token: tokens.refresh_token || null,
      })
      .eq("id", state)

    if (dbError) {
      console.error("[v0] Database update error:", dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    console.log("[v0] Calendar connected successfully!")
    console.log("[v0] ===== CALENDAR CALLBACK COMPLETED =====")

    return NextResponse.redirect(new URL("/dashboard?calendar_connected=true", request.url))
  } catch (error) {
    console.error("[v0] Calendar OAuth error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.redirect(
      new URL(`/dashboard?error=calendar_auth_failed&details=${encodeURIComponent(errorMessage)}`, request.url),
    )
  }
}
