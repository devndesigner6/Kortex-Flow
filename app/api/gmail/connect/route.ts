import { getAuthenticatedUser } from "@/lib/firebase/api-helpers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { user, error: authError } = await getAuthenticatedUser(request)

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Use the actual request origin for dynamic URL
  const appUrl = request.nextUrl.origin
  const redirectUri = `${appUrl}/api/gmail/callback`

  console.log("[v0] Gmail OAuth - App URL:", appUrl)
  console.log("[v0] Gmail OAuth - Redirect URI:", redirectUri)

  // Build OAuth URL for Gmail
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
    access_type: "offline",
    prompt: "consent",
    state: user.id,
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.json({ url: authUrl })
}
