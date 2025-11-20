import { NextResponse } from "next/server"
import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"

export async function POST(request: Request) {
  try {
    // Firebase initialized via helpers
    const { user, error: authError } = await getAuthenticatedUser(request)

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await request.json()

    // Update the event to mark it as confirmed
    const { error } = await supabase
      .from("calendar_events")
      .update({ needs_confirmation: false })
      .eq("id", eventId)
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error confirming event:", error)
    return NextResponse.json({ error: "Failed to confirm event" }, { status: 500 })
  }
}


