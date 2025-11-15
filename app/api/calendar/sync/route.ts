import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { refreshGoogleToken } from "@/lib/google-oauth"

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("calendar_access_token, calendar_refresh_token")
      .eq("id", user.id)
      .single()

    if (!profile?.calendar_access_token) {
      return NextResponse.json({ error: "Calendar not connected" }, { status: 400 })
    }

    let accessToken = profile.calendar_access_token

    const now = new Date().toISOString()
    const sixMonthsLater = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()

    let calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${sixMonthsLater}&maxResults=250&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (calendarResponse.status === 401 && profile.calendar_refresh_token) {
      console.log("[v0] Access token expired, refreshing...")
      const newToken = await refreshGoogleToken(profile.calendar_refresh_token)

      if (newToken) {
        // Update token in database
        await supabase.from("profiles").update({ calendar_access_token: newToken }).eq("id", user.id)

        accessToken = newToken

        // Retry request with new token
        calendarResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${sixMonthsLater}&maxResults=250&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
      } else {
        return NextResponse.json({ error: "Token refresh failed. Please reconnect Calendar." }, { status: 401 })
      }
    }

    const calendarData = await calendarResponse.json()

    if (!calendarData.items || calendarData.items.length === 0) {
      return NextResponse.json({ synced: 0 })
    }

    // Parse and store events
    const eventsToInsert = calendarData.items.map((event: any) => {
      const userAttendee = event.attendees?.find((a: any) => a.self === true)
      const needsConfirmation = userAttendee?.responseStatus === "needsAction" || event.status === "tentative"

      return {
        user_id: user.id,
        google_event_id: event.id,
        title: event.summary || "No Title",
        description: event.description || null,
        start_time: event.start.dateTime || event.start.date,
        end_time: event.end.dateTime || event.end.date,
        location: event.location || null,
        attendees: event.attendees?.map((a: any) => a.email) || [],
        needs_confirmation: needsConfirmation,
      }
    })

    const { error } = await supabase.from("calendar_events").upsert(eventsToInsert, {
      onConflict: "google_event_id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("[v0] Error inserting calendar events:", error)
      throw error
    }

    return NextResponse.json({ synced: eventsToInsert.length })
  } catch (error) {
    console.error("[v0] Calendar sync error:", error)
    return NextResponse.json({ error: "Failed to sync calendar" }, { status: 500 })
  }
}
