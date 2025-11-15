import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
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
