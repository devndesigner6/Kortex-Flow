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
    // Remove Gmail access token from profile
    const { error } = await supabase
      .from("profiles")
      .update({
        gmail_access_token: null,
        gmail_refresh_token: null,
      })
      .eq("id", user.id)

    if (error) {
      console.error("[v0] Error disconnecting Gmail:", error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gmail disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect Gmail" }, { status: 500 })
  }
}
