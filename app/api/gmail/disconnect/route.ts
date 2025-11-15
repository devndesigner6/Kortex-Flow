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
    const { error: tokenError } = await supabase
      .from("profiles")
      .update({
        gmail_access_token: null,
        gmail_refresh_token: null,
      })
      .eq("id", user.id)

    if (tokenError) {
      console.error("[v0] Error clearing Gmail tokens:", tokenError)
      throw tokenError
    }

    const { error: emailsError } = await supabase
      .from("emails")
      .delete()
      .eq("user_id", user.id)

    if (emailsError) {
      console.error("[v0] Error deleting emails:", emailsError)
      throw emailsError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gmail disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect Gmail" }, { status: 500 })
  }
}
