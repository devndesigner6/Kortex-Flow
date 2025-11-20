import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"
import { NextResponse } from "next/server"

export async function POST() {
  // Firebase initialized via helpers

  const { user, error: authError } = await getAuthenticatedUser(request)

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { error: tokenError } = await supabase
      .from("profiles")
      .update({
        calendar_access_token: null,
        calendar_refresh_token: null,
      })
      .eq("id", user.id)

    if (tokenError) {
      console.error("[v0] Error clearing Calendar tokens:", tokenError)
      throw tokenError
    }

    const { error: eventsError } = await supabase
      .from("calendar_events")
      .delete()
      .eq("user_id", user.id)

    if (eventsError) {
      console.error("[v0] Error deleting calendar events:", eventsError)
      throw eventsError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Calendar disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect Calendar" }, { status: 500 })
  }
}


