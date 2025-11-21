import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Firebase initialized via helpers

  const { user, error: authError } = await getAuthenticatedUser(request)

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Use environment variable or request origin (but not 0.0.0.0)
  const origin = request.nextUrl.origin
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (origin.includes('0.0.0.0') ? 'https://kortexflow-1098890500978.us-central1.run.app' : origin)
  const redirectUri = `${appUrl}/api/calendar/callback`

  console.log("[v0] Calendar OAuth - App URL:", appUrl)
  console.log("[v0] Calendar OAuth - Redirect URI:", redirectUri)

  // Build OAuth URL for Google Calendar
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    access_type: "offline",
    prompt: "consent",
    state: user.id,
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.json({ url: authUrl })
}


